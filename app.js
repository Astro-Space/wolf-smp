// ─────────────────────────────────────────
//   WOLF SMP — App Logic
// ─────────────────────────────────────────

const SERVER_HOST = 'wolfhouse.dat.airforce';
const SERVER_PORT = 19132;
const API_URL = `https://api.mcsrvstat.us/bedrock/3/${SERVER_HOST}`;

// ── After splash, reveal the app ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('app').classList.remove('hidden');
    fetchServerData();
  }, 3200);
});

// ── Fetch server data from mcsrvstat ──
async function fetchServerData() {
  const statusDot = document.getElementById('statusDot');
  const playerCount = document.getElementById('playerCount');
  const playerMax = document.getElementById('playerMax');
  const playerBar = document.getElementById('playerBar');
  const playerList = document.getElementById('playerList');
  const lastUpdated = document.getElementById('lastUpdated');

  // Loading state
  playerList.innerHTML = `
    <div class="loading-state">
      <span class="loading-dots">Fetching pack members<span class="dots"></span></span>
    </div>`;

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const now = new Date();
    lastUpdated.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (data.online) {
      // Server online
      statusDot.className = 'status-dot online';

      const online = data.players?.online ?? 0;
      const max = data.players?.max ?? 0;

      playerCount.textContent = online;
      playerMax.textContent = max;

      // Progress bar
      const pct = max > 0 ? Math.round((online / max) * 100) : 0;
      playerBar.style.width = pct + '%';

      // Player list
      const names = data.players?.list ?? [];

      if (online === 0 || names.length === 0) {
        playerList.innerHTML = `<div class="no-players">The pack is resting — no players online.</div>`;
      } else {
        playerList.innerHTML = '';
        names.forEach((player, i) => {
          const name = typeof player === 'string' ? player : player.name;
          const item = document.createElement('div');
          item.className = 'player-item';
          item.style.animationDelay = `${i * 80}ms`;
          item.innerHTML = `
            <div class="player-avatar">🐺</div>
            <span class="player-name">${escapeHtml(name)}</span>
            <div class="player-online-dot"></div>
          `;
          playerList.appendChild(item);
        });
      }
    } else {
      // Server offline
      statusDot.className = 'status-dot offline';
      playerCount.textContent = '0';
      playerMax.textContent = '—';
      playerBar.style.width = '0%';
      playerList.innerHTML = `<div class="offline-state">Server is currently offline. The wolves have retreated.</div>`;
    }

  } catch (err) {
    console.error('Failed to fetch server data:', err);
    statusDot.className = 'status-dot offline';
    playerList.innerHTML = `<div class="offline-state">Could not reach the server. Check your connection.</div>`;
    lastUpdated.textContent = 'Failed';
  }
}

// ── Copy to clipboard ──
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'COPIED';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'COPY';
      btn.classList.remove('copied');
    }, 1800);
  }).catch(() => {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    btn.textContent = 'COPIED';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'COPY';
      btn.classList.remove('copied');
    }, 1800);
  });
}

// ── Security helper ──
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Register service worker for PWA ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Wolf SMP SW registered:', reg.scope))
      .catch(err => console.log('SW registration failed:', err));
  });
}
