(() => {
  const KEY = 'very-own-repo:reader-marker:v1';
  const deck = document.getElementById('deck');
  const slides = deck ? [...deck.querySelectorAll('.gulp')] : [];
  const utilities = document.querySelector('.utilities');
  if (!deck || !slides.length || !utilities) return;

  const isHome = /\/very-own-repo\/?$/.test(location.pathname) || /\/index\.html$/.test(location.pathname);

  function readMarker() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
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
    if (!marker || !marker.path || !Number.isFinite(marker.place)) return null;
    return `${marker.path}#place=${marker.place + 1}`;
  }

  function saveMarker(button) {
    const place = currentPlace();
    const marker = {
      path: location.pathname,
      place,
      chapter: chapterLabel(),
      title: document.title,
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(marker));
      button.textContent = 'Marker left';
      button.dataset.marked = 'true';
      setTimeout(() => {
        button.textContent = 'Leave marker';
        button.dataset.marked = 'false';
      }, 1800);
      refreshHome(marker);
    } catch (_) {
      button.textContent = 'Could not mark';
    }
  }

  function makeButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'reader-marker-button';
    button.textContent = 'Leave marker';
    button.setAttribute('aria-label', 'Leave a marker at this point in the reading');
    button.addEventListener('click', () => saveMarker(button));
    utilities.appendChild(button);
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .reader-marker-button{appearance:none;border:0;background:none;padding:0;color:inherit;font:inherit;cursor:pointer}
      .reader-marker-button:hover,.reader-marker-button:focus-visible{color:var(--green,#91efb9);outline:none}
      .reader-marker-button[data-marked="true"]{color:var(--green,#91efb9)}
      .reader-resume{color:var(--green,#91efb9)!important;text-decoration:none}
      .reader-marker-note{margin-top:2rem!important;padding-top:1rem;border-top:1px solid var(--line,rgba(220,230,223,.14));color:var(--muted,#7f8983);font-family:system-ui,sans-serif!important;font-size:clamp(.78rem,1.8vw,.9rem)!important;line-height:1.5!important;letter-spacing:.01em}
      .reader-marker-note a{color:var(--green,#91efb9);text-decoration:none;white-space:nowrap}
    `;
    document.head.appendChild(style);
  }

  function refreshHome(marker = readMarker()) {
    if (!isHome) return;
    const firstInner = slides[0] && slides[0].querySelector('.inner');
    if (!firstInner) return;

    let note = firstInner.querySelector('.reader-marker-note');
    if (!note) {
      note = document.createElement('p');
      note.className = 'reader-marker-note';
      firstInner.appendChild(note);
    }

    const oldResume = utilities.querySelector('.reader-resume');
    if (oldResume) oldResume.remove();

    const href = markerHref(marker);
    if (href) {
      note.innerHTML = `You left a marker in ${escapeHtml(marker.chapter || 'the reading')}. <a href="${href}">Return to it.</a>`;
      const resume = document.createElement('a');
      resume.className = 'reader-resume';
      resume.href = href;
      resume.textContent = 'Return to marker';
      utilities.appendChild(resume);
    } else {
      note.textContent = 'If you think you’ll be back here often, leave a marker when you stop. This browser will remember exactly where you were.';
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function restoreFromHash() {
    const match = location.hash.match(/(?:^#|&)place=(\d+)/);
    if (!match) return;
    const requested = Number(match[1]) - 1;
    if (!Number.isFinite(requested)) return;
    const place = Math.max(0, Math.min(slides.length - 1, requested));
    requestAnimationFrame(() => requestAnimationFrame(() => {
      deck.scrollTo({ left: place * deck.clientWidth, behavior: 'auto' });
    }));
  }

  addStyles();
  makeButton();
  refreshHome();
  restoreFromHash();
})();
