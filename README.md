# CloudCore — Intelligent Web-Based Cloud System

A fully-featured, dark-themed cloud infrastructure management dashboard built with
pure HTML, CSS, and JavaScript — no frameworks, no build step required.

## 📁 Project Structure

```
cloud-system/
├── index.html   ← Main application shell + all pages
├── style.css    ← All styles (variables, layout, components)
├── app.js       ← All logic (data, rendering, navigation, live ticker)
└── README.md    ← This file
```

## 🚀 How to Run

1. Open `index.html` directly in any modern browser.
   No server or build tool needed.

   Or serve with a simple local server:
   ```bash
   npx serve .
   # or
   python3 -m http.server 3000
   ```

2. Visit `http://localhost:3000`

## 📦 Features

### Dashboard (Home)
- **Live KPI Cards** — Active Nodes, Requests/sec, Avg Latency, Error Rate
- **Animated Sparklines** — canvas-drawn, auto-refresh every click
- **Resource Gauges** — SVG ring charts for CPU, Memory, Disk I/O
- **Node Cluster Status** — 6 distributed nodes with health indicators + CPU bars
- **24-Hour Traffic Chart** — bar chart with peak-hour highlighting
- **Live Event Log** — auto-injects new entries every 12 seconds
- **AI Anomaly Alert** — dismissable alert strip at top

### Navigation Pages
| Page         | Content |
|--------------|---------|
| Analytics    | 30-day request chart, region breakdown, error breakdown, AI insights |
| Alerts       | Severity-classified alert cards (critical / warning / info) |
| Compute      | Full node grid — 12 nodes across all regions with CPU + memory bars |
| Storage      | Object store, block volumes, DB clusters with usage bars + data table |
| Networking   | Edge stats, CDN hit rate, network topology diagram |
| Security     | Threat stats, SSL status, compliance score, threat event log |
| AI Predictions | Traffic forecast, failure prediction, cost optimisation cards |
| Auto-Scaling | Live policy editor with sliders + min/max node controls |
| Settings     | Toggle switches for AI engine, auto-remediation, notifications, dark mode |

## 🎨 Design System

CSS custom properties in `:root` control the entire colour palette.
Switch to light mode via the ☀ button in the top bar, or via Settings.

```css
--cyan:   #00e5ff   (primary accent)
--green:  #00ff88   (success / healthy)
--purple: #7c3aff   (memory / AI)
--amber:  #ffb300   (warnings)
--red:    #ff4757   (errors / critical)
```

## ⚡ Live Ticker

- **RPS** updates every 3 seconds with a random value
- **Latency** updates every 5 seconds
- **Log rows** auto-inject every 12 seconds (capped at 15 entries)
- **Status pill** in topbar reflects node health state

## 🛠 Extending the Project

### Add a new page
1. Add a `<section class="page" id="page-YOURPAGE">` in `index.html`
2. Add a `.nav-item` with `data-page="YOURPAGE"` in the sidebar
3. Add a `case 'YOURPAGE':` in `onPageEnter()` in `app.js`
4. Add an entry to `PAGE_TITLES` in `app.js`

### Add real backend data
Replace the static arrays at the top of `app.js` with `fetch()` calls:
```js
const NODES = await fetch('/api/nodes').then(r => r.json());
```

### Dark / Light theming
All colours use `var(--*)` so switching themes is a single class toggle on `<body>`.

## 📋 Browser Support

Works in all modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
No polyfills needed.

---
Built as a demonstration of a production-grade cloud system UI.
Pure HTML/CSS/JS — zero dependencies, zero build step.
