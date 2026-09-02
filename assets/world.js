(() => {
  const PLACE_KEY = 'very-own-repo:declared-place:v1';
  const API_KEY = 'very-own-repo:spread-api:v1';

  const $ = id => document.getElementById(id);
  const placeForm = $('placeForm');
  const placeInput = $('place');
  const placeStatus = $('placeStatus');
  const localPlace = $('localPlace');
  const mReaders = $('mReaders');
  const mPlaces = $('mPlaces');
  const mCountries = $('mCountries');
  const mDeep = $('mDeep');
  const mapEmpty = $('mapEmpty');
  const ledger = $('ledger');

  function readJson(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { return false; }
  }

  function apiBase() {
    const configured = readJson(API_KEY);
    if (configured && typeof configured.url === 'string') return configured.url.replace(/\/$/, '');
    return null;
  }

  function renderLocalPlace() {
    const saved = readJson(PLACE_KEY);
    localPlace.textContent = saved && saved.place
      ? `You said: ${saved.place}. This is saved only in this browser until the public ledger is connected.`
      : 'No place saved here yet.';
  }

  function normalisePlace(value) {
    return value.trim().replace(/\s+/g, ' ').slice(0, 80);
  }

  async function sendPlace(place) {
    const base = apiBase();
    if (!base) return { connected:false };
    const response = await fetch(`${base}/place`, {
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({ place })
    });
    if (!response.ok) throw new Error('place submission failed');
    return { connected:true, data:await response.json() };
  }

  placeForm.addEventListener('submit', async event => {
    event.preventDefault();
    const place = normalisePlace(placeInput.value);
    if (!place) {
      placeStatus.textContent = 'Write a city, region, or country first.';
      return;
    }

    writeJson(PLACE_KEY, { place, savedAt:new Date().toISOString() });
    renderLocalPlace();
    placeStatus.textContent = 'Saved here.';

    try {
      const result = await sendPlace(place);
      if (result.connected) {
        placeStatus.textContent = 'You are on the public trail.';
        await loadPublicState();
      } else {
        placeStatus.textContent = 'Saved in this browser. The shared world ledger is not connected yet.';
      }
    } catch (_) {
      placeStatus.textContent = 'Saved in this browser. The shared ledger could not be reached.';
    }
  });

  function formatNumber(value) {
    return Number.isFinite(value) ? new Intl.NumberFormat().format(value) : '—';
  }

  function renderMetrics(data) {
    mReaders.textContent = formatNumber(data.arrivals);
    mPlaces.textContent = formatNumber(data.places || 0);
    mCountries.textContent = formatNumber(data.countries || 0);
    mDeep.textContent = data.deepest || '—';
  }

  function renderDepth(rows) {
    const bars = [...document.querySelectorAll('#depthBars .bar')];
    bars.forEach((bar, index) => {
      const row = rows && rows[index];
      const fill = bar.querySelector('.fill');
      const value = bar.lastElementChild;
      if (!row || !Number.isFinite(row.percent)) {
        fill.style.width = '0';
        value.textContent = '—';
        return;
      }
      fill.style.width = `${Math.max(0, Math.min(100, row.percent))}%`;
      value.textContent = `${row.percent.toFixed(row.percent < 10 ? 1 : 0)}%`;
    });
  }

  function renderLedger(rows) {
    if (!Array.isArray(rows) || !rows.length) return;
    ledger.innerHTML = '';
    rows.slice(0, 40).forEach(row => {
      const el = document.createElement('div');
      el.className = 'ledger-row';
      const time = document.createElement('span');
      const event = document.createElement('span');
      const tag = document.createElement('span');
      time.textContent = row.time || '';
      event.textContent = row.event || '';
      tag.textContent = row.tag || '';
      el.append(time,event,tag);
      ledger.appendChild(el);
    });
  }

  function project(lon, lat) {
    return {
      x: ((lon + 180) / 360) * 1000,
      y: ((90 - lat) / 180) * 500
    };
  }

  function renderMap(points) {
    if (!Array.isArray(points) || !points.length) return;
    const svg = document.querySelector('#map svg');
    const old = svg.querySelector('#reader-points');
    if (old) old.remove();
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.id = 'reader-points';
    points.forEach(point => {
      if (!Number.isFinite(point.lon) || !Number.isFinite(point.lat)) return;
      const p = project(point.lon, point.lat);
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx', p.x);
      circle.setAttribute('cy', p.y);
      circle.setAttribute('r', Math.min(11, 3 + Math.log2((point.count || 1) + 1)));
      circle.setAttribute('fill', 'rgba(145,239,185,.82)');
      circle.setAttribute('stroke', 'rgba(145,239,185,.22)');
      circle.setAttribute('stroke-width', '5');
      const title = document.createElementNS('http://www.w3.org/2000/svg','title');
      title.textContent = `${point.place || 'Reader place'} — ${point.count || 1}`;
      circle.appendChild(title);
      g.appendChild(circle);
    });
    svg.appendChild(g);
    mapEmpty.style.display = 'none';
  }

  async function loadPublicState() {
    const base = apiBase();
    if (!base) {
      renderMetrics({arrivals:NaN, places:0, countries:0, deepest:null});
      renderDepth(null);
      return;
    }
    try {
      const response = await fetch(`${base}/state`, { headers:{accept:'application/json'} });
      if (!response.ok) throw new Error('state failed');
      const data = await response.json();
      renderMetrics(data.metrics || {});
      renderDepth(data.depth || []);
      renderMap(data.points || []);
      renderLedger(data.ledger || []);
    } catch (_) {
      mapEmpty.textContent = 'The public ledger is configured but unavailable right now. No substitute data is being shown.';
    }
  }

  renderLocalPlace();
  loadPublicState();
})();
