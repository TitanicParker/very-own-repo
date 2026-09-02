(() => {
  const KEY = 'very-own-repo:reader-marker:v1';
  const deck = document.getElementById('deck');
  const slides = deck ? [...deck.querySelectorAll('.gulp')] : [];
  const utilities = document.querySelector('.utilities');
  if (!deck || !slides.length || !utilities) return;
  if (document.documentElement.dataset.readerMarkerReady === 'true') return;
  document.documentElement.dataset.readerMarkerReady = 'true';

  const isHome = /\/very-own-repo\/?$/.test(location.pathname) || /\/index\.html$/.test(location.pathname);

  function normalizePath(path) {
    try {
      const url = new URL(path, location.origin);
      let value = url.pathname.replace(/\/index\.html$/i, '/');
      if (value.length > 1) value = value.replace(/\/+$/, '');
      return value;
    } catch (_) {
      return String(path || '').replace(/\/index\.html$/i, '/').replace(/\/+$/, '');
    }
  }

  function readMarker() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const marker = JSON.parse(raw);
      if (!marker || typeof marker.path !== 'string') return null;
      if (!Number.isInteger(marker.place) || marker.place < 0) return null;
      return marker;
    } catch (_) {
      return null;
    }
  }

  function currentPlace() {
    return Math.max(0, Math.min(slides.length - 1, Math.round(deck.scrollLeft / Math.max(1, deck.clientWidth))));
  }

  function chapterLabel() {
    const eyebrow = document.querySelector('.eyebrow');
    if (eyebrow && eyebrow.textContent.trim()) return eyebrow.textContent.trim();
    return isHome ? 'Introduction' : document.title.replace(/\s+[—-]\s+Very Own Repo.*$/i, '').trim();
  }

  function markerHref(marker) {
    if (!marker) return null;
    try {
      const url = new URL(marker.path, location.origin);
      if (url.origin !== location.origin) return null;
      url.hash = `place=${marker.place + 1}`;
      return `${url.pathname}${url.search}${url.hash}`;
    } catch (_) {
      return null;
    }
  }

  function isAtMarker(marker) {
    return Boolean(
      marker &&
      normalizePath(marker.path) === normalizePath(location.pathname) &&
      marker.place === currentPlace()
    );
  }

  function saveMarker(button) {
    const marker = {
      path: location.pathname,
      place: currentPlace(),
      chapter: chapterLabel(),
      title: document.title,
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(marker));
      button.textContent = 'Marker left';
      button.dataset.marked = 'true';
      renderResume(marker);
      setTimeout(() => {
        button.textContent = 'Leave marker';
        button.dataset.marked = 'false';
      }, 1800);
    } catch (_) {
      button.textContent = 'Could not mark';
    }
  }

  function makeButton() {
    let button = utilities.querySelector('.reader-marker-button');
    if (button) return button;
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'reader-marker-button';
    button.textContent = 'Leave marker';
    button.setAttribute('aria-label', 'Leave a marker at this point in the reading');
    button.addEventListener('click', () => saveMarker(button));
    utilities.appendChild(button);
    return button;
  }

  function addStyles() {
    if (document.getElementById('reader-marker-styles')) return;
    const style = document.createElement('style');
    style.id = 'reader-marker-styles';
    style.textContent = `
      .reader-marker-button{appearance:none;border:0;background:none;padding:0;color:inherit;font:inherit;cursor:pointer}
      .reader-marker-button:hover,.reader-marker-button:focus-visible{color:var(--green,#91efb9);outline:none}
      .reader-marker-button[data-marked="true"]{color:var(--green,#91efb9)}
      .reader-resume{color:var(--green,#91efb9)!important;text-decoration:none;white-space:nowrap}
      .reader-at-marker{color:var(--muted,#7f8983)!important;white-space:nowrap}
      .reader-marker-note{margin-top:2rem!important;padding-top:1rem;border-top:1px solid var(--line,rgba(220,230,223,.14));color:var(--muted,#7f8983);font-family:system-ui,sans-serif!important;font-size:clamp(.78rem,1.8vw,.9rem)!important;line-height:1.5!important;letter-spacing:.01em}
      .reader-marker-note a{color:var(--green,#91efb9);text-decoration:none;white-space:nowrap}
    `;
    document.head.appendChild(style);
  }

  function renderResume(marker = readMarker()) {
    const oldResume = utilities.querySelector('.reader-resume,.reader-at-marker');
    if (oldResume) oldResume.remove();

    if (isHome) {
      const firstInner = slides[0] && slides[0].querySelector('.inner');
      if (firstInner) {
        const oldNote = firstInner.querySelector('.reader-marker-note');
        if (oldNote) oldNote.remove();
      }
    }

    const href = markerHref(marker);
    if (!href) return;

    if (isAtMarker(marker)) {
      const here = document.createElement('span');
      here.className = 'reader-at-marker';
      here.textContent = 'At marker';
      utilities.appendChild(here);
    } else {
      const resume = document.createElement('a');
      resume.className = 'reader-resume';
      resume.href = href;
      resume.textContent = 'Return to marker';
      resume.setAttribute('aria-label', `Return to saved place in ${marker.chapter || 'the reading'}`);
      utilities.appendChild(resume);
    }

    if (isHome) {
      const firstInner = slides[0] && slides[0].querySelector('.inner');
      if (!firstInner) return;
      const note = document.createElement('p');
      note.className = 'reader-marker-note';
      note.innerHTML = `You left a marker in ${escapeHtml(marker.chapter || 'the reading')}. <a href="${href}">Return to it.</a>`;
      firstInner.appendChild(note);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function requestedPlace() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    const raw = params.get('place');
    if (!raw || !/^\d+$/.test(raw)) return null;
    const requested = Number(raw) - 1;
    if (!Number.isFinite(requested)) return null;
    return Math.max(0, Math.min(slides.length - 1, requested));
  }

  function restoreFromHash() {
    const place = requestedPlace();
    if (place === null) return;

    const settle = () => {
      const left = place * Math.max(1, deck.clientWidth);
      deck.scrollLeft = left;
    };

    settle();
    requestAnimationFrame(() => {
      settle();
      requestAnimationFrame(() => {
        settle();
        renderResume();
      });
    });
    setTimeout(() => {
      settle();
      renderResume();
    }, 120);
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (requestedPlace() === null) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(restoreFromHash, 80);
  });
  window.addEventListener('pageshow', restoreFromHash);
  window.addEventListener('hashchange', restoreFromHash);
  deck.addEventListener('scroll', () => requestAnimationFrame(() => renderResume()), { passive: true });

  addStyles();
  makeButton();
  restoreFromHash();
  renderResume();
})();
