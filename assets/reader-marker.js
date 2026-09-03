(() => {
  const PROGRESS_KEY = 'very-own-repo:reading-position:v2';
  const LEGACY_KEY = 'very-own-repo:reader-marker:v1';
  const deck = document.getElementById('deck');
  const slides = deck ? [...deck.querySelectorAll('.gulp')] : [];
  const utilities = document.querySelector('.utilities');
  const cue = document.getElementById('cue') || document.querySelector('.cue');
  const progress = document.getElementById('progress') || document.querySelector('.progress');
  const isHome = /\/very-own-repo\/?$/.test(location.pathname) || /\/index\.html$/.test(location.pathname);

  function loadSiteUtilities() {
    if (document.querySelector('script[data-meaning-site-utilities]') || window.__meaningSiteUtilitiesReady) return;
    const script = document.createElement('script');
    script.dataset.meaningSiteUtilities = 'true';
    script.src = new URL(isHome ? 'assets/site-utilities.js' : '../assets/site-utilities.js', location.href).href;
    script.defer = true;
    document.body.appendChild(script);
  }
  loadSiteUtilities();

  if (!deck || !slides.length) return;
  if (document.documentElement.dataset.readerProgressReady === 'true') return;
  document.documentElement.dataset.readerProgressReady = 'true';

  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const episodes = {
    '001-meaning-is-not-everything.html': { episode: 1, title: 'Meaning Is Not Everything' },
    '002-enough-is-a-shape.html': { episode: 2, title: 'Enough Is a Shape' },
    '003-the-whole-world-in-a-doorway.html': { episode: 3, title: 'The Whole World in a Doorway' },
    '004-the-whole-field.html': { episode: 4, title: 'The Whole Field' },
    '005-the-testing-field.html': { episode: 5, title: 'The Testing Field' },
    '006-completion-makes-continuation-possible.html': { episode: 6, title: 'Completion Makes Continuation Possible' },
    '007-jog-your-imagination.html': { episode: 7, title: 'Jog Your Imagination' },
    '008-what-remains.html': { episode: 8, title: 'What Remains' },
    '009-the-sentence-is-not-the-landing.html': { episode: 9, title: 'The Sentence Is Not the Landing' },
    '010-completion-can-reopen.html': { episode: 10, title: 'Completion Can Reopen' },
    '011-a-correction-is-not-a-rewind.html': { episode: 11, title: 'A Correction Is Not a Rewind' },
    '012-how-much-can-a-small-thing-carry.html': { episode: 12, title: 'How Much Can a Small Thing Carry?' },
    '013-enough-between-us.html': { episode: 13, title: 'Enough Between Us' },
    '014-leave-a-way-back.html': { episode: 14, title: 'Leave a Way Back' },
    '015-the-slipper-survived-midnight.html': { episode: 15, title: 'The Slipper Survived Midnight' },
    '016-the-compass-kept-its-promise.html': { episode: 16, title: 'An Appeal to Reason' },
    '017-enough-has-degrees.html': { episode: 17, title: 'Enough Has Degrees' },
    '018-two-ways-to-arrive.html': { episode: 18, title: 'Two Ways to Arrive' },
    '019-the-map-has-a-rhythm.html': { episode: 19, title: 'The Map Has a Rhythm' },
    '020-before-the-example-exists.html': { episode: 20, title: 'Before the Example Exists' },
    '021-the-map-outgrew-the-sentence.html': { episode: 21, title: 'The Map Outgrew the Sentence' },
    '022-whose-subject-is-this.html': { episode: 22, title: 'Whose Subject Is This?' },
    '023-what-would-make-us-wrong.html': { episode: 23, title: 'What Would Make Us Wrong?' }
  };
  const knownNext = {
    '001-meaning-is-not-everything.html': '002-enough-is-a-shape.html',
    '002-enough-is-a-shape.html': '003-the-whole-world-in-a-doorway.html',
    '003-the-whole-world-in-a-doorway.html': '004-the-whole-field.html',
    '004-the-whole-field.html': '005-the-testing-field.html',
    '005-the-testing-field.html': '006-completion-makes-continuation-possible.html',
    '006-completion-makes-continuation-possible.html': '007-jog-your-imagination.html',
    '007-jog-your-imagination.html': '008-what-remains.html',
    '008-what-remains.html': '009-the-sentence-is-not-the-landing.html',
    '009-the-sentence-is-not-the-landing.html': '010-completion-can-reopen.html',
    '010-completion-can-reopen.html': '011-a-correction-is-not-a-rewind.html',
    '011-a-correction-is-not-a-rewind.html': '012-how-much-can-a-small-thing-carry.html',
    '012-how-much-can-a-small-thing-carry.html': '013-enough-between-us.html',
    '013-enough-between-us.html': '014-leave-a-way-back.html',
    '014-leave-a-way-back.html': '015-the-slipper-survived-midnight.html',
    '015-the-slipper-survived-midnight.html': '016-the-compass-kept-its-promise.html',
    '016-the-compass-kept-its-promise.html': '017-enough-has-degrees.html',
    '017-enough-has-degrees.html': '018-two-ways-to-arrive.html',
    '018-two-ways-to-arrive.html': '019-the-map-has-a-rhythm.html',
    '019-the-map-has-a-rhythm.html': '020-before-the-example-exists.html',
    '020-before-the-example-exists.html': '021-the-map-outgrew-the-sentence.html',
    '021-the-map-outgrew-the-sentence.html': '022-whose-subject-is-this.html',
    '022-whose-subject-is-this.html': '023-what-would-make-us-wrong.html'
  };
  const meta = episodes[currentFile] || { episode: 0, title: 'Introduction' };
  const nextHref = isHome ? 'posts/001-meaning-is-not-everything.html' : (knownNext[currentFile] || null);
  let wheelCarry = 0, wheelReset = null, touchStartX = null, touchStartY = null, saveTimer = null;

  function publicEpisodeLanguage() {
    document.querySelectorAll('.eyebrow').forEach(node => { node.textContent = node.textContent.replace(/^Chapter\b/i, 'Episode'); });
    document.querySelectorAll('[aria-label]').forEach(node => { const value = node.getAttribute('aria-label'); if (value) node.setAttribute('aria-label', value.replace(/^Chapter\b/i, 'Episode')); });
    if (utilities) utilities.querySelectorAll('a').forEach(link => { link.textContent = link.textContent.replace(/^Chapter\b/i, 'Episode'); if (/book\.html(?:$|[?#])/.test(link.getAttribute('href') || '')) link.textContent = 'Episodes'; if (/world\.html(?:$|[?#])/.test(link.getAttribute('href') || '')) link.remove(); });
  }

  function syncEntranceEpisodes() {
    if (!isHome) return;
    const list = document.querySelector('.episode-list');
    if (!list) return;
    Object.entries(episodes).forEach(([file, item]) => {
      if (list.querySelector(`a[href="posts/${file}"]`)) return;
      const link = document.createElement('a');
      link.className = 'episode-link';
      link.href = `posts/${file}`;
      link.innerHTML = `<span class="episode-no">${String(item.episode).padStart(2,'0')}</span><span class="episode-title">${item.title}</span>`;
      list.appendChild(link);
    });
  }

  function currentPlace() { return Math.max(0, Math.min(slides.length - 1, Math.round(deck.scrollLeft / Math.max(1, deck.clientWidth)))); }
  function atLastPlace() { return currentPlace() === slides.length - 1; }
  function activeSlideAtBottom() { const slide = slides[currentPlace()]; return !slide || slide.scrollHeight <= slide.clientHeight + 3 || slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 3; }
  function updateProgress() { if (progress) progress.innerHTML = `<span class="live">${currentPlace() + 1}</span> / ${slides.length}`; }
  function migrateLegacy() { try { if (localStorage.getItem(PROGRESS_KEY)) return; const raw = localStorage.getItem(LEGACY_KEY); if (!raw) return; const old = JSON.parse(raw); if (!old || typeof old.path !== 'string' || !Number.isInteger(old.place)) return; const file = old.path.split('/').pop() || ''; const oldMeta = episodes[file] || { episode: 0, title: old.chapter || 'Introduction' }; localStorage.setItem(PROGRESS_KEY, JSON.stringify({ path: old.path, place: Math.max(0, old.place), episode: oldMeta.episode, title: oldMeta.title, total: null, updatedAt: old.savedAt || new Date().toISOString() })); localStorage.removeItem(LEGACY_KEY); } catch (_) {} }
  function saveCurrent() { if (isHome) return; try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({ path: location.pathname, place: currentPlace(), episode: meta.episode, title: meta.title, total: slides.length, updatedAt: new Date().toISOString() })); } catch (_) {} }
  function queueSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveCurrent, 90); }
  function requestedPlace() { const params = new URLSearchParams(location.hash.replace(/^#/, '')); const raw = params.get('place'); if (!raw || !/^\d+$/.test(raw)) return null; return Math.max(0, Math.min(slides.length - 1, Number(raw) - 1)); }
  function restoreFromHash() { const place = requestedPlace(); if (place === null) return; const settle = () => { deck.scrollLeft = place * Math.max(1, deck.clientWidth); }; settle(); requestAnimationFrame(() => requestAnimationFrame(() => { settle(); updateProgress(); updateContinuationCue(); queueSave(); })); setTimeout(() => { settle(); updateProgress(); updateContinuationCue(); queueSave(); }, 120); }
  function goNext() { if (nextHref) location.href = nextHref; }
  function updateContinuationCue() { if (!cue) return; const last = atLastPlace(); cue.classList.toggle('reader-can-continue', Boolean(last && nextHref)); if (last && nextHref) { cue.textContent = 'Continue'; cue.setAttribute('role', 'link'); cue.setAttribute('tabindex', '0'); cue.setAttribute('aria-label', 'Continue to the next episode'); } else { cue.textContent = last ? 'Latest episode' : 'Swipe for more'; cue.removeAttribute('role'); cue.removeAttribute('tabindex'); cue.removeAttribute('aria-label'); } }
  function addStyles() { if (document.getElementById('reader-progress-styles')) return; const style = document.createElement('style'); style.id = 'reader-progress-styles'; style.textContent = `.cue.reader-can-continue{pointer-events:auto!important;cursor:pointer;text-decoration:none;user-select:none}.cue.reader-can-continue:hover,.cue.reader-can-continue:focus-visible{filter:brightness(1.2);outline:none}`; document.head.appendChild(style); }

  deck.addEventListener('scroll', () => requestAnimationFrame(() => { updateProgress(); updateContinuationCue(); queueSave(); }), { passive: true });
  deck.addEventListener('touchstart', event => { const touch = event.changedTouches[0]; touchStartX = touch.clientX; touchStartY = touch.clientY; }, { passive: true });
  deck.addEventListener('touchend', event => { if (touchStartX === null) return; const touch = event.changedTouches[0], dx = touch.clientX - touchStartX, dy = touch.clientY - touchStartY; if (atLastPlace() && nextHref && dx < -46 && Math.abs(dx) > Math.abs(dy) * 1.15) goNext(); touchStartX = null; touchStartY = null; }, { passive: true });
  deck.addEventListener('wheel', event => { if (!atLastPlace() || !nextHref || !activeSlideAtBottom()) return; const forward = Math.max(event.deltaX, event.deltaY); if (forward <= 0) return; wheelCarry += forward; clearTimeout(wheelReset); wheelReset = setTimeout(() => { wheelCarry = 0; }, 450); if (wheelCarry > 110) { wheelCarry = 0; goNext(); } }, { passive: true });
  document.addEventListener('keydown', event => { if (!atLastPlace() || !nextHref) return; if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); event.stopImmediatePropagation(); goNext(); } }, true);
  if (cue) { cue.addEventListener('click', () => { if (atLastPlace() && nextHref) goNext(); }); cue.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && atLastPlace() && nextHref) { event.preventDefault(); goNext(); } }); }
  window.addEventListener('resize', () => { if (requestedPlace() !== null) restoreFromHash(); updateProgress(); updateContinuationCue(); });
  window.addEventListener('pageshow', () => { restoreFromHash(); updateProgress(); updateContinuationCue(); queueSave(); });
  window.addEventListener('hashchange', restoreFromHash);
  window.addEventListener('pagehide', saveCurrent);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveCurrent(); });
  if ('serviceWorker' in navigator) { const worker = new URL(isHome ? 'service-worker.js' : '../service-worker.js', location.href); navigator.serviceWorker.register(worker.href).catch(() => {}); }

  migrateLegacy(); publicEpisodeLanguage(); syncEntranceEpisodes(); addStyles(); restoreFromHash(); updateProgress(); updateContinuationCue(); queueSave();
})();