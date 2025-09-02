# AidRoute — Humanitarian Last-Mile Logistics Simulator

[![CI/CD](https://github.com/abdlrrahman/aidroute/actions/workflows/ci.yml/badge.svg)](https://github.com/abdlrrahman/aidroute/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://abdlrrahman.github.io/aidroute/)

> **"I build explainable digital products that convert operational data and budgets into measurable financial, service, and social outcomes."** — Abdlrrahman Shibani

---

## Executive Overview

**AidRoute** is an interactive, explainable humanitarian vehicle routing and relief supply chain simulator. It models the multi-criteria trade-offs emergency response teams face when dispatching medical, nutritional, and shelter supplies across complex, crisis-affected operational corridors.

---

## Core Capabilities

1. **Multi-Objective Corridor Route Optimization:**
   - Heuristic Dijkstra graph solver balancing Distance, Transit Time, Security Threats, Checkpoint Clearances, and Fuel Expenditure.
   - 5 operational optimization profiles: Balanced, Fastest, Safest, Most Economical, and Cold-Chain Sensitive.

2. **Cold-Chain Vaccine Assurance:**
   - Thermal excursion risk modeling for temperature-sensitive medical cargo (2°C - 8°C).
   - Automated allocation of refrigerated reefer carriers and excursion alert warnings on journeys exceeding 18–24 hours.

3. **Ton-Kilometer ($/Ton-Km) Unit Economics:**
   - Audit-ready operational expenditure waterfall: Fuel burn, armed security escorts, driver hazard allowances, checkpoint tolls, reefer power, and fleet vehicle amortization.

4. **Interactive Geographic Corridor Map & Live Convoy Dispatch:**
   - Visual SVG map of Libyan transport networks connecting Western, Eastern, Central, and Southern hubs.
   - Dynamic convoy dispatch animation showing leg-by-leg progression and security threat color coding.

5. **Operational Shock & Crisis Stress Lab:**
   - Real-time simulation of coastal highway blockades (Sirte cut), national diesel price spikes (+65%), and southern border conflict escalations.

6. **Bilingual Arabic & English Support:**
   - Native Right-to-Left (RTL) Arabic interface alongside English (LTR).

---

## Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Build & Test:** Vite 8, Vitest, JSDOM, GitHub Actions
- **Data Governance:** 100% deterministic synthetic logistics model — zero real, confidential, or sensitive agency data.
- **Deployment:** Client-side static build on GitHub Pages.

---

## Getting Started

```bash
# Clone repository
git clone https://github.com/abdlrrahman/aidroute.git
cd aidroute

# Install dependencies
npm install

# Run local dev server
npm run dev

# Run test suite
npm run test

# Build production bundle
npm run build
```

---

## Documentation

- [Architecture & Data Flow](docs/architecture.md)
- [Methodology & Operations Research](docs/methodology.md)
- [Humanitarian Logistics Case Study](docs/case-study.md)
- [Supply Chain Data Dictionary](docs/data-dictionary.md)
- [5-Minute Demonstration Script](docs/demo-script.md)

---

## License

MIT License © 2026 Abdlrrahman Shibani.
