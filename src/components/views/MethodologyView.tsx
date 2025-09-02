
import React from 'react';
import {
  BookOpen,
  Compass,
  DollarSign,
  Thermometer,
  Lock,
  CheckCircle2,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Architecture, Operations Research & Mathematical Models
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Technical specifications for AidRoute: Multi-objective graph optimization, ton-kilometer unit economics, and cold-chain integrity assurance.
        </p>
      </div>

      {/* 4 Methodological Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Multi-Objective Dijkstra Algorithm */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <Compass className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Multi-Objective Graph Optimization
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            AidRoute models the road infrastructure as a directed graph $G = (V, E)$. The traversal penalty $W(e)$ for each corridor edge $e$ is parameterized by the user's operational goal:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
            W(e) = w_d &middot; Distance(e) + w_t &middot; Time(e) + w_r &middot; Threat(e) + w_c &middot; Cost(e)
          </div>
          <p className="text-xs text-slate-500">
            Transit time accounts for road degradation speed coefficients (paved 1.0x, degraded 0.8x, desert track 0.6x) plus dynamic checkpoint clearance queues.
          </p>
        </div>

        {/* 2. Ton-Kilometer Unit Economics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <DollarSign className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Ton-Kilometer Unit Economic Accounting
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Humanitarian supply chain efficiency is evaluated on a cost-per-metric-ton-kilometer basis:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
            Cost_per_Ton_Km = Total_Mission_Outlay / (&Sigma; Payload_Tons &times; Total_Distance_Km)
          </div>
          <p className="text-xs text-slate-500">
            Enables institutional donors (UN, USAID, ECHO) to benchmark logistics efficiency against global humanitarian standards ($0.08 - $0.25 / ton-km).
          </p>
        </div>

        {/* 3. Cold-Chain Vaccine Safety Model */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sky-600">
            <Thermometer className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Cold-Chain Thermal Excursion Risk
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Temperature-sensitive medical supplies (vaccines, insulin) require strict adherence to 2°C - 8°C storage windows:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
            Excursion_Risk = Total_Transit_Time &gt; Max_Excursion_Threshold (18h - 24h)
          </div>
          <p className="text-xs text-slate-500">
            Routes exceeding safe limits trigger mandatory reefer fleet allocation and route re-weighting to avoid vaccine degradation.
          </p>
        </div>

        {/* 4. Synthetic Data Governance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-600">
            <Lock className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Data Governance & Client-Side Execution
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All 10 hubs, 15 corridors, 12 cargo manifests, and crisis shocks are deterministic synthetic models:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Zero real-world sensitive or restricted agency coordinates.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>100% client-side execution in React without external tracking servers.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Auditable heuristic math with full transparency.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
