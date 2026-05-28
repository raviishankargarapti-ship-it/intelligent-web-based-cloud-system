/* ===================================================
   CLOUDCORE — Intelligent Web-Based Cloud System
   app.js  —  All application logic
   =================================================== */

'use strict';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const NODES = [
  { name: 'US-EAST-1a',    region: 'N. Virginia',  cpu: 62, mem: 58, status: 'ok'   },
  { name: 'US-EAST-1b',    region: 'N. Virginia',  cpu: 71, mem: 64, status: 'ok'   },
  { name: 'US-WEST-2a',    region: 'Oregon',        cpu: 45, mem: 40, status: 'ok'   },
  { name: 'EU-CENTRAL-1',  region: 'Frankfurt',     cpu: 88, mem: 82, status: 'warn' },
  { name: 'AP-EAST-3',     region: 'Hong Kong',     cpu: 94, mem: 91, status: 'err'  },
  { name: 'AP-SOUTH-1',    region: 'Mumbai',        cpu: 38, mem: 35, status: 'ok'   },
];

const ALL_NODES = [
  ...NODES,
  { name: 'SA-EAST-1',     region: 'São Paulo',     cpu: 52, mem: 48, status: 'ok'   },
  { name: 'EU-WEST-2',     region: 'London',        cpu: 67, mem: 61, status: 'ok'   },
  { name: 'US-EAST-2',     region: 'Ohio',          cpu: 43, mem: 39, status: 'ok'   },
  { name: 'AP-NORTHEAST-1',region: 'Tokyo',         cpu: 78, mem: 74, status: 'warn' },
  { name: 'CA-CENTRAL-1',  region: 'Montreal',      cpu: 34, mem: 31, status: 'ok'   },
  { name: 'ME-SOUTH-1',    region: 'Bahrain',       cpu: 29, mem: 26, status: 'ok'   },
];

const EVENTS = [
  { t:'18:42:03', lvl:'info',  msg:'Auto-scaler added 3 nodes in US-EAST-1 cluster' },
  { t:'18:41:57', lvl:'warn',  msg:'AP-EAST-3 latency exceeded 75ms threshold' },
  { t:'18:41:44', lvl:'info',  msg:'AI prediction: traffic spike expected +23% at 19:00' },
  { t:'18:41:30', lvl:'ok',    msg:'EU-CENTRAL-1 remediation script executed successfully' },
  { t:'18:40:58', lvl:'error', msg:'AP-EAST-3 health check failed — failover initiated' },
  { t:'18:40:22', lvl:'info',  msg:'SSL certificates renewed across 12 edge nodes' },
  { t:'18:39:45', lvl:'warn',  msg:'Memory pressure on EU-CENTRAL-1 reaching 88%' },
  { t:'18:38:11', lvl:'ok',    msg:'Database backup completed — 2.3 TB compressed' },
  { t:'18:37:02', lvl:'info',  msg:'CDN cache hit rate improved to 94.2% after AI tuning' },
  { t:'18:35:50', lvl:'info',  msg:'Auto-scaling policy evaluated — no action required' },
];

const THREATS = [
  { t:'18:40:12', lvl:'error', msg:'DDoS probe blocked from 45.227.*.* — 12,400 req/s dropped' },
  { t:'18:38:44', lvl:'warn',  msg:'Unusual login pattern from IP 203.0.113.42 — MFA triggered' },
  { t:'18:35:20', lvl:'warn',  msg:'Port scan detected on edge-node EU-WEST-2 — firewall updated' },
  { t:'18:30:05', lvl:'info',  msg:'WAF rule XSS-0182 triggered — request sanitised' },
  { t:'18:28:33', lvl:'ok',    msg:'Vulnerability scan completed — 0 critical issues found' },
];

const ALERTS_DATA = [
  { sev:'critical', icon:'ti-alert-octagon', title:'AP-EAST-3 Node Degraded', msg:'Health checks failing for 8 minutes. Failover initiated to AP-EAST-3b. AI recommends restart.', time:'18:40:58' },
  { sev:'warning',  icon:'ti-cpu',           title:'EU-CENTRAL-1 CPU Spike',  msg:'CPU sustained above 85% for 12 minutes. Consider scale-out or workload rebalancing.', time:'18:39:15' },
  { sev:'info',     icon:'ti-chart-line',    title:'Traffic Spike Predicted',  msg:'AI model predicts +23% request volume at 19:00 UTC. 3 nodes pre-provisioned.', time:'18:41:44' },
  { sev:'warning',  icon:'ti-database',      title:'EU-CENTRAL-1 Memory Pressure', msg:'Memory utilisation at 88%. GC pauses increasing. Review heap allocation.', time:'18:39:45' },
];

const STORAGE_ROWS = [
  { name:'obj-store-us-1',  type:'Object Store',  cap:'100 TB', used:'42 TB', health:'Healthy' },
  { name:'obj-store-eu-1',  type:'Object Store',  cap:'100 TB', used:'38 TB', health:'Healthy' },
  { name:'block-us-east',   type:'Block Volume',  cap:'80 TB',  used:'28 TB', health:'Healthy' },
  { name:'block-eu-central',type:'Block Volume',  cap:'60 TB',  used:'22 TB', health:'Degraded'},
  { name:'db-cluster-us',   type:'Database',      cap:'50 TB',  used:'9 TB',  health:'Healthy' },
  { name:'db-cluster-eu',   type:'Database',      cap:'30 TB',  used:'7 TB',  health:'Healthy' },
  { name:'db-cluster-ap',   type:'Database',      cap:'20 TB',  used:'2 TB',  health:'Healthy' },
];

const REGIONS = [
  { name: 'us-east-1',  pct: 38 },
  { name: 'eu-central', pct: 24 },
  { name: 'ap-east',    pct: 18 },
  { name: 'us-west-2',  pct: 12 },
  { name: 'sa-east-1',  pct: 8  },
];

const ERRORS = [
  { code: '500', count: '12,840', pct: 72, color: '#ff4757' },
  { code: '502', count: '3,210',  pct: 18, color: '#ffb300' },
  { code: '404', count: '1,440',  pct: 8,  color: '#00e5ff' },
  { code: '429', count: '380',    pct: 2,  color: '#7c3aff' },
];

const AI_INSIGHTS = [
  { color: '#00ff88', text: 'Traffic patterns suggest a 23% spike at 19:00 UTC with 91% confidence.' },
  { color: '#ffb300', text: 'AP-EAST-3 shows early disk degradation — preventive replacement recommended.' },
  { color: '#00e5ff', text: 'Rightsizing 6 nodes could reduce monthly compute cost by $4,200.' },
  { color: '#7c3aff', text: 'CDN cache rules updated — estimated 8% latency reduction applied.' },
];

const TRAFFIC_DATA = [12,8,6,5,6,9,14,18,22,26,28,24,20,22,26,28,30,35,32,28,22,18,15,12];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const genSpark = (len, lo, hi) => Array.from({ length: len }, () => rnd(lo, hi));

function drawSparkline(id, data, color) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth || 200;
  const h = canvas.offsetHeight || 34;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '44');
  grad.addColorStop(1, color + '00');
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
}

function drawAnalyticsChart() {
  const canvas = document.getElementById('chart-analytics');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth || 600;
  const h = 120;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const data = Array.from({ length: 30 }, () => rnd(8000, 20000));
  const isDark = !document.body.classList.contains('light');
  const lineColor = '#00e5ff';
  const textColor = isDark ? '#5a6a8a' : '#8895b0';
  const min = 0, max = Math.max(...data) * 1.1;
  const pad = { top: 10, bottom: 24, left: 10, right: 10 };
  const uw = w - pad.left - pad.right;
  const uh = h - pad.top - pad.bottom;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, lineColor + '30');
  grad.addColorStop(1, lineColor + '00');
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.left + (i / (data.length - 1)) * uw;
    const y = pad.top + uh - ((v - min) / (max - min)) * uh;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + uw, h - pad.bottom);
  ctx.lineTo(pad.left, h - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.left + (i / (data.length - 1)) * uw;
    const y = pad.top + uh - ((v - min) / (max - min)) * uh;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = lineColor; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.font = '10px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ['Day 1','Day 7','Day 14','Day 21','Day 30'].forEach((label, i) => {
    const x = pad.left + (i / 4) * uw;
    ctx.fillText(label, x, h - 6);
  });
}

function buildGauge(el) {
  if (!el) return;
  const val   = parseInt(el.dataset.value);
  const color = el.dataset.color || '#00e5ff';
  const r     = 24;
  const circ  = 2 * Math.PI * r;
  const offset = circ - (val / 100) * circ;
  const isDark = !document.body.classList.contains('light');
  const trackColor = isDark ? '#1e2638' : '#dde2ee';
  el.innerHTML = `
    <svg viewBox="0 0 60 60" width="64" height="64">
      <circle cx="30" cy="30" r="${r}" fill="none" stroke="${trackColor}" stroke-width="5"/>
      <circle cx="30" cy="30" r="${r}" fill="none" stroke="${color}"
        stroke-width="5"
        stroke-dasharray="${circ.toFixed(1)}"
        stroke-dashoffset="${offset.toFixed(1)}"
        stroke-linecap="round"
        style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset .8s ease"/>
    </svg>
    <div class="gauge-label" style="color:${color}">${val}%</div>
  `;
}

// ─────────────────────────────────────────────
// RENDER FUNCTIONS
// ─────────────────────────────────────────────

function renderNodes() {
  const nl = document.getElementById('node-list');
  if (!nl) return;
  nl.innerHTML = NODES.map(n => {
    const cls  = n.status === 'ok' ? 'ok' : n.status === 'warn' ? 'warn' : 'err';
    const bcls = n.status === 'ok' ? 'bar-ok' : n.status === 'warn' ? 'bar-warn' : 'bar-err';
    return `<div class="node-row">
      <div class="node-status ${cls}"></div>
      <div class="node-name">${n.name}</div>
      <div class="node-meta">${n.cpu}% cpu</div>
      <div class="node-bar-wrap">
        <div class="node-bar ${bcls}" style="width:${n.cpu}%"></div>
      </div>
    </div>`;
  }).join('');
}

function renderLogs() {
  const ll = document.getElementById('log-list');
  if (!ll) return;
  ll.innerHTML = EVENTS.map(l => `
    <div class="log-row">
      <span class="log-time">${l.t}</span>
      <span class="log-level lvl-${l.lvl}">${l.lvl.toUpperCase()}</span>
      <span class="log-msg">${l.msg}</span>
    </div>`).join('');
}

function renderTraffic() {
  const container = document.getElementById('traffic-bars');
  if (!container) return;
  const max = Math.max(...TRAFFIC_DATA);
  container.innerHTML = TRAFFIC_DATA.map((v, i) => {
    const h = Math.round((v / max) * 100);
    const active = i >= 16 && i <= 18;
    return `<div class="tbar${active ? ' active' : ''}" style="height:${h}%"></div>`;
  }).join('');
}

function renderComputeGrid() {
  const cg = document.getElementById('compute-grid');
  if (!cg) return;
  cg.innerHTML = ALL_NODES.map(n => {
    const sc  = n.status === 'ok' ? 'ok' : n.status === 'warn' ? 'warn' : 'err';
    const bc  = n.status === 'ok' ? 'var(--green)' : n.status === 'warn' ? 'var(--amber)' : 'var(--red)';
    return `<div class="compute-node">
      <div class="cn-header">
        <div class="node-status ${sc}"></div>
        <div>
          <div class="cn-name">${n.name}</div>
          <div class="cn-region">${n.region}</div>
        </div>
      </div>
      <div class="cn-metrics">
        <div class="cn-metric-row">
          <span class="cn-metric-label">CPU</span>
          <span class="cn-metric-val" style="color:${bc}">${n.cpu}%</span>
        </div>
        <div class="cn-bar-wrap"><div class="cn-bar" style="width:${n.cpu}%;background:${bc}"></div></div>
        <div class="cn-metric-row" style="margin-top:6px">
          <span class="cn-metric-label">MEM</span>
          <span class="cn-metric-val" style="color:var(--purple)">${n.mem}%</span>
        </div>
        <div class="cn-bar-wrap"><div class="cn-bar" style="width:${n.mem}%;background:var(--purple)"></div></div>
      </div>
    </div>`;
  }).join('');
}

function renderAlerts() {
  const al = document.getElementById('alerts-list');
  if (!al) return;
  al.innerHTML = ALERTS_DATA.map(a => `
    <div class="alert-card ${a.sev}">
      <div class="alert-icon ${a.sev}"><i class="ti ${a.icon}"></i></div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-meta">${a.time} &nbsp;·&nbsp; ${a.sev.toUpperCase()}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:5px;line-height:1.5">${a.msg}</div>
      </div>
    </div>`).join('');
}

function renderStorageTable() {
  const t = document.getElementById('storage-table');
  if (!t) return;
  t.innerHTML = `<thead><tr>
    <th>Name</th><th>Type</th><th>Capacity</th><th>Used</th><th>Health</th>
  </tr></thead><tbody>` +
  STORAGE_ROWS.map(r => {
    const hc = r.health === 'Healthy' ? 'var(--green)' : 'var(--amber)';
    return `<tr>
      <td style="font-weight:600">${r.name}</td>
      <td style="color:var(--muted)">${r.type}</td>
      <td>${r.cap}</td><td>${r.used}</td>
      <td style="color:${hc};font-weight:600">${r.health}</td>
    </tr>`;
  }).join('') + '</tbody>';
}

function renderNetworkDiagram() {
  const nd = document.getElementById('network-diagram');
  if (!nd) return;
  const nodes = [
    { icon: 'ti-world',        label: 'Internet'   },
    { icon: 'ti-shield',       label: 'WAF / DDoS' },
    { icon: 'ti-git-merge',    label: 'Load Bal.'  },
    { icon: 'ti-server',       label: 'App Nodes'  },
    { icon: 'ti-database',     label: 'DB Cluster' },
  ];
  nd.style.display = 'flex';
  nd.style.alignItems = 'center';
  nd.style.gap = '0';
  nd.innerHTML = nodes.map((n, i) => `
    <div class="nd-node">
      <div class="nd-icon"><i class="ti ${n.icon}"></i></div>
      <div class="nd-label">${n.label}</div>
    </div>
    ${i < nodes.length - 1 ? '<div class="nd-connector"></div>' : ''}`).join('');
}

function renderRegions() {
  const rl = document.getElementById('region-list');
  if (!rl) return;
  rl.innerHTML = REGIONS.map(r => `
    <div class="region-row">
      <span class="region-name">${r.name}</span>
      <div class="region-bar-wrap"><div class="region-bar" style="width:${r.pct}%"></div></div>
      <span class="region-pct">${r.pct}%</span>
    </div>`).join('');
}

function renderErrors() {
  const eb = document.getElementById('error-breakdown');
  if (!eb) return;
  eb.innerHTML = ERRORS.map(e => `
    <div class="eb-row">
      <span class="eb-code">${e.code}</span>
      <div class="eb-bar-wrap"><div class="eb-bar" style="width:${e.pct}%;background:${e.color}"></div></div>
      <span class="eb-count">${e.count}</span>
    </div>`).join('');
}

function renderInsights() {
  const ai = document.getElementById('ai-insights');
  if (!ai) return;
  ai.innerHTML = AI_INSIGHTS.map(i => `
    <div class="insight-row">
      <div class="insight-dot" style="background:${i.color}"></div>
      <div class="insight-text">${i.text}</div>
    </div>`).join('');
}

function renderThreatLog() {
  const tl = document.getElementById('threat-log');
  if (!tl) return;
  tl.innerHTML = THREATS.map(l => `
    <div class="log-row">
      <span class="log-time">${l.t}</span>
      <span class="log-level lvl-${l.lvl}">${l.lvl.toUpperCase()}</span>
      <span class="log-msg">${l.msg}</span>
    </div>`).join('');
}

function renderAllGauges() {
  buildGauge(document.getElementById('gauge-cpu'));
  buildGauge(document.getElementById('gauge-mem'));
  buildGauge(document.getElementById('gauge-disk'));
}

// ─────────────────────────────────────────────
// SPARKLINES
// ─────────────────────────────────────────────

function renderSparklines() {
  drawSparkline('sp1', genSpark(20, 40, 52),    '#00ff88');
  drawSparkline('sp2', genSpark(20, 8000, 16000),'#00e5ff');
  drawSparkline('sp3', genSpark(20, 20, 55),    '#ffb300');
  drawSparkline('sp4', genSpark(20, 0, 1),       '#00ff88');
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

const PAGE_TITLES = {
  dashboard:   'Dashboard',
  analytics:   'Analytics',
  alerts:      'Alerts',
  compute:     'Compute',
  storage:     'Storage',
  networking:  'Networking',
  security:    'Security',
  predictions: 'AI Predictions',
  autoscale:   'Auto-Scaling',
  settings:    'Settings',
};

function navigate(el) {
  const page = el.dataset.page;
  if (!page) return;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  // Update title
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = PAGE_TITLES[page] || page;

  // Lazy render page content
  onPageEnter(page);

  // Close sidebar on mobile
  if (window.innerWidth < 640) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function onPageEnter(page) {
  switch (page) {
    case 'analytics':
      setTimeout(() => { renderRegions(); renderErrors(); renderInsights(); drawAnalyticsChart(); }, 10);
      break;
    case 'alerts':
      renderAlerts();
      break;
    case 'compute':
      renderComputeGrid();
      break;
    case 'storage':
      renderStorageTable();
      break;
    case 'networking':
      renderNetworkDiagram();
      break;
    case 'security':
      renderThreatLog();
      break;
  }
}

// ─────────────────────────────────────────────
// UI ACTIONS
// ─────────────────────────────────────────────

function refreshAll() {
  renderSparklines();
  renderNodes();
  // Randomly update KPI values
  const rps = (rnd(10000, 16000)).toLocaleString();
  const lat = rnd(22, 48) + 'ms';
  const errEl = document.getElementById('kpi-rps');
  const latEl = document.getElementById('kpi-lat');
  if (errEl) errEl.textContent = rps;
  if (latEl) latEl.textContent = lat;
  // Flash refresh icon
  const icon = document.querySelector('.topbar .btn-icon i.ti-refresh');
  if (icon) {
    icon.style.transform = 'rotate(360deg)';
    icon.style.transition = 'transform .5s ease';
    setTimeout(() => { icon.style.transform = ''; icon.style.transition = ''; }, 600);
  }
}

function dismissAlert() {
  const strip = document.getElementById('alert-strip');
  if (strip) {
    strip.style.opacity = '0';
    strip.style.transition = 'opacity .3s';
    setTimeout(() => strip.remove(), 300);
  }
}

function clearLogs() {
  const ll = document.getElementById('log-list');
  if (ll) ll.innerHTML = '<div class="log-row"><span class="log-msg" style="color:var(--muted)">Log cleared.</span></div>';
}

function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const wrapper  = document.getElementById('wrapper');
  if (window.innerWidth < 640) {
    sidebar.classList.toggle('open');
  } else {
    sidebar.classList.toggle('collapsed');
    wrapper.classList.toggle('collapsed');
  }
}

let _lightMode = false;
function toggleTheme() {
  _lightMode = !_lightMode;
  document.body.classList.toggle('light', _lightMode);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.innerHTML = _lightMode ? '<i class="ti ti-moon"></i>' : '<i class="ti ti-sun"></i>';
  // Re-render gauges to pick up new track colour
  renderAllGauges();
}

// ─────────────────────────────────────────────
// LIVE TICKER
// ─────────────────────────────────────────────

function startTicker() {
  // RPS updates every 3s
  setInterval(() => {
    const el = document.getElementById('kpi-rps');
    if (el) el.textContent = (rnd(10000, 16000)).toLocaleString();
  }, 3000);

  // Latency flicker
  setInterval(() => {
    const el = document.getElementById('kpi-lat');
    if (el) el.textContent = rnd(22, 48) + 'ms';
  }, 5000);

  // Inject a new log line every 12s
  setInterval(() => {
    const msgs = [
      { lvl: 'info',  msg: 'Heartbeat received from all healthy nodes' },
      { lvl: 'ok',    msg: 'Auto-scaler health check passed' },
      { lvl: 'info',  msg: 'CDN cache purge completed — 3.2 GB cleared' },
      { lvl: 'warn',  msg: 'EU-CENTRAL-1 sustained load above 80%' },
      { lvl: 'info',  msg: 'AI model retrained with 24h traffic data' },
    ];
    const entry  = msgs[rnd(0, msgs.length - 1)];
    const now    = new Date();
    const time   = now.toTimeString().slice(0, 8);
    const ll     = document.getElementById('log-list');
    if (!ll) return;
    const row = document.createElement('div');
    row.className = 'log-row';
    row.style.animation = 'fadeUp .3s ease both';
    row.innerHTML = `
      <span class="log-time">${time}</span>
      <span class="log-level lvl-${entry.lvl}">${entry.lvl.toUpperCase()}</span>
      <span class="log-msg">${entry.msg}</span>`;
    ll.prepend(row);
    // Cap list at 15 rows
    while (ll.children.length > 15) ll.removeChild(ll.lastChild);
  }, 12000);

  // Update status pill
  setInterval(() => {
    const pill = document.getElementById('status-pill');
    if (!pill) return;
    const hasErr = NODES.some(n => n.status === 'err');
    if (hasErr) {
      pill.textContent  = '⚠ DEGRADED NODE DETECTED';
      pill.className    = 'status-pill warning';
    } else {
      pill.textContent  = '● ALL SYSTEMS OPERATIONAL';
      pill.className    = 'status-pill';
    }
  }, 10000);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
  renderNodes();
  renderLogs();
  renderTraffic();
  renderAllGauges();
  // Sparklines need layout to be complete
  requestAnimationFrame(() => {
    requestAnimationFrame(renderSparklines);
  });
  startTicker();
}

document.addEventListener('DOMContentLoaded', init);

// Re-draw sparklines on resize
window.addEventListener('resize', () => {
  clearTimeout(window._resizeTimer);
  window._resizeTimer = setTimeout(renderSparklines, 200);
});
