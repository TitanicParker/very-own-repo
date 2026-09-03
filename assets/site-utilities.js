(() => {
  if (window.__meaningSiteUtilitiesReady) return;
  window.__meaningSiteUtilitiesReady = true;

  const COUNTER_NAMESPACE = 'titanicparker-very-own-repo';
  const COUNTER_KEY = 'reader-opens';
  const COUNTER_BASE = `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;
  const SESSION_KEY = 'meaning-reader:visit-counted:v1';
  const LOCAL_COUNT_KEY = 'meaning-reader:last-global-count:v1';

  const legacyShare = document.getElementById('shareButton');
  const legacyStatus = document.getElementById('shareStatus');
  if (legacyShare) legacyShare.hidden = true;
  if (legacyStatus) legacyStatus.hidden = true;

  const style = document.createElement('style');
  style.id = 'meaning-global-tools-style';
  style.textContent = `
    #meaning-global-share,#meaning-global-count{position:fixed;z-index:10000;bottom:max(1rem,env(safe-area-inset-bottom));font:600 .66rem/1 system-ui,sans-serif;letter-spacing:.08em;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
    #meaning-global-share{left:max(1rem,env(safe-area-inset-left));display:flex;align-items:center;gap:.5rem}
    #meaning-global-share button{appearance:none;border:1px solid rgba(145,239,185,.22);border-radius:999px;background:rgba(9,11,10,.72);padding:.58rem .78rem;color:#91efb9;cursor:pointer;font:inherit;letter-spacing:inherit}
    #meaning-global-share button:hover,#meaning-global-share button:focus-visible{border-color:rgba(145,239,185,.62);outline:none;background:rgba(145,239,185,.06)}
    #meaning-share-status{color:#aab1ad;font-size:.62rem;letter-spacing:.04em;min-width:0}
    #meaning-global-count{right:max(1rem,env(safe-area-inset-right));display:flex;align-items:center;gap:.38rem;border:1px solid rgba(220,230,223,.12);border-radius:999px;background:rgba(9,11,10,.72);padding:.58rem .72rem;color:#8d9791;white-space:nowrap}
    #meaning-global-count .meaning-count-dot{width:.42rem;height:.42rem;border-radius:50%;background:#c96b76;box-shadow:0 0 12px rgba(201,107,118,.45)}
    #meaning-global-count strong{color:#91efb9;font-weight:700;font-variant-numeric:tabular-nums;transition:transform .2s ease,color .2s ease}
    #meaning-global-count.bump strong{transform:translateY(-2px) scale(1.08);color:#f0f3f1}
    #meaning-global-count.bump .meaning-count-dot{box-shadow:0 0 20px rgba(201,107,118,.8)}
    #meaning-global-count .meaning-count-label{font-weight:500;color:#8d9791}
    @media(max-width:520px){#meaning-global-share,#meaning-global-count{font-size:.61rem}#meaning-global-share button,#meaning-global-count{padding:.52rem .66rem}}
  `;
  document.head.appendChild(style);

  const shareWrap = document.createElement('div');
  shareWrap.id = 'meaning-global-share';
  shareWrap.innerHTML = '<button type="button" aria-label="Share this reading">Share</button><span id="meaning-share-status" aria-live="polite"></span>';
  document.body.appendChild(shareWrap);

  const countWrap = document.createElement('div');
  countWrap.id = 'meaning-global-count';
  countWrap.title = 'Reading visits. One count is added when a new browser or app session enters the book.';
  countWrap.innerHTML = '<span class="meaning-count-dot" aria-hidden="true"></span><strong id="meaning-count-value">…</strong><span class="meaning-count-label">visits</span>';
  document.body.appendChild(countWrap);

  const shareButton = shareWrap.querySelector('button');
  const shareStatus = shareWrap.querySelector('#meaning-share-status');
  const countValue = countWrap.querySelector('#meaning-count-value');

  function currentShareUrl() {
    const url = new URL(location.href);
    if (/^#place=\d+$/i.test(url.hash)) url.hash = '';
    return url.href;
  }

  function copyFallback(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    area.remove();
    return copied;
  }

  shareButton.addEventListener('click', async () => {
    const url = currentShareUrl();
    const title = document.title || 'Meaning Is Not Everything';
    const data = { title, text: 'Meaning Is Not Everything — a serial book about completed intelligibility.', url };
    shareStatus.textContent = '';
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(url);
      else if (!copyFallback(url)) throw new Error('copy unavailable');
      shareStatus.textContent = 'Copied';
      setTimeout(() => { if (shareStatus.textContent === 'Copied') shareStatus.textContent = ''; }, 1500);
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      shareStatus.textContent = 'Copy failed';
      setTimeout(() => { if (shareStatus.textContent === 'Copy failed') shareStatus.textContent = ''; }, 1800);
    }
  });

  function showCount(value, animate = false) {
    if (!Number.isFinite(value)) return;
    countValue.textContent = new Intl.NumberFormat().format(value);
    if (animate) {
      countWrap.classList.remove('bump');
      requestAnimationFrame(() => {
        countWrap.classList.add('bump');
        setTimeout(() => countWrap.classList.remove('bump'), 520);
      });
    }
    try { localStorage.setItem(LOCAL_COUNT_KEY, String(value)); } catch (_) {}
  }

  function getCounter(path = '/') {
    return fetch(`${COUNTER_BASE}${path}`, { cache: 'no-store', mode: 'cors', referrerPolicy: 'no-referrer' })
      .then(response => {
        if (!response.ok) throw new Error(`counter ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (!data || typeof data.count !== 'number') throw new Error('counter response');
        return data.count;
      });
  }

  let cachedCount = null;
  try {
    const raw = localStorage.getItem(LOCAL_COUNT_KEY);
    if (raw !== null && /^\d+$/.test(raw)) cachedCount = Number(raw);
  } catch (_) {}
  if (cachedCount !== null) showCount(cachedCount, false);

  let alreadyCounted = false;
  try { alreadyCounted = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (_) {}

  if (alreadyCounted) {
    getCounter('/')
      .then(value => showCount(value, cachedCount !== null && value !== cachedCount))
      .catch(() => { if (cachedCount === null) countValue.textContent = '—'; });
    return;
  }

  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (_) {}

  getCounter('/')
    .then(before => {
      showCount(before, false);
      return new Promise(resolve => setTimeout(resolve, 420)).then(() => getCounter('/up'));
    })
    .then(after => showCount(after, true))
    .catch(() => {
      getCounter('/up')
        .then(after => showCount(after, true))
        .catch(() => {
          if (cachedCount === null) countValue.textContent = '—';
          try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
        });
    });
})();