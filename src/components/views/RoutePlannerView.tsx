import React, { useState } from 'react';
import {
  Compass,
  Navigation,
  ShieldCheck,
  Zap,
  DollarSign,
  Thermometer,
  Clock,
  Fuel,
  AlertTriangle,
  Leaf,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { OptimizationGoal } from '../../types/logistics';

export const RoutePlannerView: React.FC = () => {
  const {
    t,
    language,
    hubs,
    corridors,
    originHubId,
    setOriginHubId,
    destinationHubId,
    setDestinationHubId,
    optimizationGoal,
    setOptimizationGoal,
    calculatedRoute,
    selectedCargo
  } = useApp();

  // Custom Heuristic Weights Sandbox
  const [threatWeight, setThreatWeight] = useState<number>(1.5);
  const [speedWeight, setSpeedWeight] = useState<number>(1.0);
  const [fuelWeight, setFuelWeight] = useState<number>(1.0);

  const goals: { id: OptimizationGoal; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'balanced', label: t('goalBalanced'), desc: 'Equal weighting of speed, security, and fuel economy.', icon: <Compass className="w-4 h-4" /> },
    { id: 'fastest', label: t('goalFastest'), desc: 'Paved highways and minimal checkpoint clearance delays.', icon: <Zap className="w-4 h-4" /> },
    { id: 'safest', label: t('goalSafest'), desc: 'Avoids High/Critical security corridors and hot-zones.', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'cheapest', label: t('goalCheapest'), desc: 'Minimizes fuel consumption, tolls, and security escort fees.', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'coldchain', label: t('goalColdchain'), desc: 'Guarantees transit time within vaccine excursion limits.', icon: <Thermometer className="w-4 h-4" /> }
  ];

  // Environmental emission calculation (2.68 kg CO2 / liter diesel)
  const co2Kg = calculatedRoute ? Math.round(calculatedRoute.totalFuelLiters * 2.68) : 0;
  const co2PerTonKm = calculatedRoute && selectedCargo.length > 0
    ? (co2Kg / Math.max(1, calculatedRoute.totalDistanceKm * selectedCargo.reduce((s, c) => s + c.weightTons, 0))).toFixed(3)
    : '0.045';

  return (
    <div className="space-y-6">
      {/* Route Setup Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Humanitarian Corridor Route Optimizer
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-criteria heuristic optimization solving vehicle routing under security threat, terrain friction, and cold-chain constraints.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 self-start md:self-auto">
            {selectedCargo.length} Cargo Line-Items Selected
          </span>
        </div>

        {/* Origin & Destination Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{t('origin')}</span>
            </label>
            <select
              value={originHubId}
              onChange={e => setOriginHubId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500"
            >
              {hubs.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name[language]} ({h.region.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{t('destination')}</span>
            </label>
            <select
              value={destinationHubId}
              onChange={e => setDestinationHubId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500"
            >
              {hubs.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name[language]} ({h.region.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optimization Goals Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {t('optimizationGoal')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {goals.map(g => (
              <button
                key={g.id}
                onClick={() => setOptimizationGoal(g.id)}
                className={'btn-press p-3 rounded-xl border text-left transition ' + (
                  optimizationGoal === g.id
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 shadow-sm ring-1 ring-amber-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={'p-1.5 rounded-lg ' + (optimizationGoal === g.id ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
                    {g.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{g.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{g.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculated KPIs & Environmental Carbon Footprint Row */}
      {calculatedRoute && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-500 block">{t('totalDistance')}</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {calculatedRoute.totalDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-500 block">{t('transitTime')}</span>
            <div className="text-lg font-black text-amber-600 mt-1">
              {calculatedRoute.totalTransitTimeHrs} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-500 block">{t('fuelRequired')}</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {calculatedRoute.totalFuelLiters.toLocaleString()} <span className="text-xs font-normal text-slate-400">L</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-500 block">{t('threatScore')}</span>
            <div className={'text-lg font-black mt-1 ' + (calculatedRoute.overallThreatScore > 60 ? 'text-rose-600' : calculatedRoute.overallThreatScore > 35 ? 'text-amber-600' : 'text-emerald-600')}>
              {calculatedRoute.overallThreatScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold block flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-600" /> CO₂ Footprint
            </span>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-1">
              {co2Kg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono block">{co2PerTonKm} kg/t-km</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-500 block">{t('costPerTonKm')}</span>
            <div className="text-lg font-black text-sky-600 mt-1">
              {'$' + calculatedRoute.costs.costPerTonKm}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-500 block">{t('totalCost')}</span>
            <div className="text-lg font-black text-emerald-600 mt-1">
              {'$' + calculatedRoute.costs.totalCostUsd.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Turn-by-Turn Segment Table */}
      {calculatedRoute && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-500" />
              <span>Turn-by-Turn Corridor Leg Analysis</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {calculatedRoute.corridorIds.length} Corridor Legs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Leg</th>
                  <th className="px-4 py-3">From ➔ To Hub</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Road Quality</th>
                  <th className="px-4 py-3">Security Threat</th>
                  <th className="px-4 py-3">Checkpoints</th>
                  <th className="px-4 py-3">Escort Req.</th>
                  <th className="px-4 py-3">Tolls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {calculatedRoute.corridorIds.map((cId, idx) => {
                  const corr = corridors.find(c => c.id === cId)!;
                  const fromHub = hubs.find(h => h.id === calculatedRoute.pathHubIds[idx]);
                  const toHub = hubs.find(h => h.id === calculatedRoute.pathHubIds[idx + 1]);

                  return (
                    <tr key={cId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {fromHub?.name[language]} ➔ {toHub?.name[language]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                        {corr.distanceKm} km
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-400">
                        {corr.roadQuality.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (
                            corr.threatLevel === 'critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            corr.threatLevel === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                            corr.threatLevel === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          )}
                        >
                          {corr.threatLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                        {corr.checkpointsCount} gates ({corr.avgCheckpointDelayHrs}h avg)
                      </td>
                      <td className="px-4 py-3">
                        {corr.escortRequired ? (
                          <span className="text-rose-600 font-bold">Mandatory</span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                        {'$' + corr.tollFeeUsd}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
