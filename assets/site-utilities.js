(() => {
  if (window.__meaningSiteUtilitiesReady) return;
  window.__meaningSiteUtilitiesReady = true;

  const legacyShare = document.getElementById('shareButton');
  const legacyStatus = document.getElementById('shareStatus');
  if (legacyShare) legacyShare.hidden = true;
  if (legacyStatus) legacyStatus.hidden = true;

  const style = document.createElement('style');
  style.id = 'meaning-global-tools-style';
  style.textContent = `
    #meaning-global-share,#meaning-global-count{position:fixed;z-index:10000;bottom:max(1rem,env(safe-area-inset-bottom));font:600 .7rem/1 system-ui,sans-serif;letter-spacing:.08em;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
    #meaning-global-share{left:max(1rem,env(safe-area-inset-left));display:flex;align-items:center;gap:.5rem}
    #meaning-global-share button{appearance:none;border:1px solid rgba(145,239,185,.22);border-radius:999px;background:rgba(9,11,10,.72);padding:.62rem .82rem;color:#91efb9;cursor:pointer;font:inherit;letter-spacing:inherit}
    #meaning-global-share button:hover,#meaning-global-share button:focus-visible{border-color:rgba(145,239,185,.62);outline:none;background:rgba(145,239,185,.06)}
    #meaning-share-status{color:#aab1ad;font-size:.66rem;letter-spacing:.04em;min-width:0}
    #meaning-global-count{right:max(1rem,env(safe-area-inset-right));display:flex;align-items:center;border:1px solid rgba(220,230,223,.12);border-radius:999px;background:rgba(9,11,10,.72);padding:.34rem .46rem;overflow:hidden}
    #meaning-global-count img{display:block;height:20px;width:auto;border:0}
    .meaning-episodes-fold{margin-top:.75rem;border-top:1px solid rgba(220,230,223,.12);border-bottom:1px solid rgba(220,230,223,.12)}
    .meaning-episodes-fold summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.85rem 0;cursor:pointer;color:#f0f3f1;font:500 .82rem/1.3 system-ui,sans-serif;letter-spacing:.06em}
    .meaning-episodes-fold summary::-webkit-details-marker{display:none}.meaning-episodes-fold summary::after{content:'+';color:#91efb9;font-size:1.1rem}.meaning-episodes-fold[open] summary::after{content:'−'}
    .meaning-episodes-fold .episode-list{max-height:min(54vh,34rem);overflow:auto;padding-bottom:.6rem}
    @media(max-width:520px){#meaning-global-share{font-size:.66rem}#meaning-global-share button{padding:.56rem .72rem}#meaning-global-count{padding:.28rem .38rem}}
  `;
  document.head.appendChild(style);

  const panel = document.getElementById('episodePanel');
  if (panel && !panel.querySelector('.meaning-episodes-fold')) {
    const list = panel.querySelector('.episode-list');
    const heading = panel.querySelector('h2');
    if (list) {
      const fold = document.createElement('details');
      fold.className = 'meaning-episodes-fold';
      const summary = document.createElement('summary');
      summary.textContent = 'Choose an episode';
      list.parentNode.insertBefore(fold, list);
      fold.appendChild(summary);
      fold.appendChild(list);
      if (heading) heading.hidden = true;
    }
  }

  const shareWrap = document.createElement('div');
  shareWrap.id = 'meaning-global-share';
  shareWrap.innerHTML = '<button type="button" aria-label="Share this reading">Share</button><span id="meaning-share-status" aria-live="polite"></span>';
  document.body.appendChild(shareWrap);

  const countWrap = document.createElement('div');
  countWrap.id = 'meaning-global-count';
  countWrap.title = 'Public visit count';
  const badge = document.createElement('img');
  badge.alt = 'Visit count';
  badge.src = 'https://hits.sh/titanicparker.github.io/very-own-repo.svg?label=visits&color=91efb9&labelColor=151916&view=total';
  badge.referrerPolicy = 'no-referrer';
  countWrap.appendChild(badge);
  document.body.appendChild(countWrap);

  const shareButton = shareWrap.querySelector('button');
  const shareStatus = shareWrap.querySelector('#meaning-share-status');

  function currentShareUrl() {
    const url = new URL(location.href);
    if (/^#place=\d+$/i.test(url.hash)) url.hash = '';
    return url.href;
  }

  function currentShareText() {
    const description = document.querySelector('meta[name="description"]');
    return description && description.content
      ? description.content
      : 'A serial book about the small structures through which meaning becomes clear enough to be yours.';
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
    const data = { title, text: currentShareText(), url };
    shareStatus.textContent = '';
    try {
      if (navigator.share) { await navigator.share(data); return; }
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
})();