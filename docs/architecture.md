# AidRoute Technical Architecture

## 1. System Topology

```
+---------------------------------------------------------------+
|                      React UI Layer                           |
|  [Header] [NavTabs] [Corridor Map] [Route Planner] [Cost]     |
+-------------------------------+-------------------------------+
                                |
+-------------------------------v-------------------------------+
|                      AppContext Provider                      |
|  - Active Hub Selection (Origin/Destination)                 |
|  - Cargo Line-Items & Fleet Allocation State                 |
|  - Active Operational Shock Scenarios                        |
|  - Convoy Simulation Animation Engine                        |
+-------------------------------+-------------------------------+
                                |
+-------------------------------v-------------------------------+
|                 Pure Operations Research Engine               |
|  - RouteOptimization.ts (Multi-Objective Dijkstra)          |
|  - Unit Cost Accounting ($ / Ton-Km)                          |
|  - Cold-Chain Thermal Excursion Risk Assessor                 |
+---------------------------------------------------------------+
```

## 2. Directory Layout

```
aidroute/
├── src/
│   ├── types/logistics.ts          # Schemas for Hubs, Corridors, Vehicles, Cargo
│   ├── data/seedLogistics.ts       # 10 Libyan hubs, 15 corridors, 4 vehicle types
│   ├── engine/routeOptimization.ts # Multi-objective Dijkstra & Knapsack allocation
│   ├── i18n/translations.ts        # Bilingual English/Arabic dictionary
│   ├── context/AppContext.tsx      # Reactive application state
│   ├── components/
│   │   ├── layout/                 # Header, NavTabs
│   │   └── views/                  # MapView, RoutePlanner, Fleet, Cost, Shocks, Methodology
│   ├── App.tsx                     # Top-level component
│   └── main.tsx                    # React DOM bootstrap
├── tests/
│   ├── routingEngine.test.ts       # Unit tests for routing & cost math
│   └── e2e_smoke.test.ts           # End-to-end user journey tests
└── docs/                           # Architecture, methodology, case study
```
