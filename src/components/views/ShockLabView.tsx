
import React from 'react';
import {
  AlertTriangle,
  Zap,
  Fuel,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShockLabView: React.FC = () => {
  const {
    t,
    language,
    shocks,
    activeShockId,
    setActiveShockId,
    corridors,
    toggleCorridorBlock,
    calculatedRoute
  } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Humanitarian Shock & Crisis Simulation Lab
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Stress-test relief supply chains against road blockades, fuel supply bottlenecks, checkpoint extortion, and sudden armed conflict.
            </p>
          </div>

          <button
            onClick={() => setActiveShockId('baseline')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition active:scale-95 self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetShock')}</span>
          </button>
        </div>
      </div>

      {/* Preset Crisis Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {shocks.map((s) => {
          const isActive = s.id === activeShockId;
          return (
            <div
              key={s.id}
              onClick={() => setActiveShockId(s.id)}
              className={'p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md flex flex-col justify-between space-y-4 ' + (
                isActive
                  ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/30 shadow-sm ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (
                    s.id === 'baseline' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  )}>
                    {s.id === 'baseline' ? 'Baseline' : 'Crisis Stress'}
                  </span>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {s.name[language]}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.description[language]}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div>
                  <span className="text-slate-400 block">Fuel</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.fuelPriceMultiplier}x</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Threat</span>
                  <span className="font-bold text-rose-600">{s.threatMultiplier}x</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Delay</span>
                  <span className="font-bold text-amber-600">{s.checkpointDelayMultiplier}x</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Corridor Disruption Control */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Manual Road Blockade & Interdiction Overrides</span>
        </h3>
        <p className="text-xs text-slate-500">
          Click any corridor below to simulate an immediate emergency road closure and witness instantaneous dynamic re-routing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {corridors.map((c) => {
            return (
              <button
                key={c.id}
                onClick={() => toggleCorridorBlock(c.id)}
                className={'p-3 rounded-xl border text-left flex items-center justify-between transition ' + (
                  c.isBlocked
                    ? 'border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                )}
              >
                <div>
                  <span className="text-xs font-mono block font-bold">
                    {c.fromHubId.toUpperCase()} ⟷ {c.toHubId.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {c.distanceKm} km • Threat: {c.threatLevel}
                  </span>
                </div>
                <span className={'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (
                  c.isBlocked ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                )}>
                  {c.isBlocked ? 'BLOCKED' : 'OPEN'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
