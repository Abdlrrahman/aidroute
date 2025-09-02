
import React from 'react';
import {
  DollarSign,
  Fuel,
  ShieldCheck,
  UserCheck,
  Receipt,
  Thermometer,
  Truck,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CostModelView: React.FC = () => {
  const { t, calculatedRoute, activeShock, selectedCargo } = useApp();

  if (!calculatedRoute) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
        Please select a valid origin and destination in the Route Optimizer to generate the operational cost model.
      </div>
    );
  }

  const costs = calculatedRoute.costs;
  const total = Math.max(1, costs.totalCostUsd);

  const costItems = [
    { label: t('fuelCost'), value: costs.fuelCostUsd, color: 'bg-amber-500', icon: <Fuel className="w-4 h-4 text-amber-500" /> },
    { label: t('securityEscort'), value: costs.securityEscortUsd, color: 'bg-rose-500', icon: <ShieldCheck className="w-4 h-4 text-rose-500" /> },
    { label: t('driverRisk'), value: costs.driverRiskAllowanceUsd, color: 'bg-orange-500', icon: <UserCheck className="w-4 h-4 text-orange-500" /> },
    { label: t('tollsClearance'), value: costs.tollsAndClearanceUsd, color: 'bg-indigo-500', icon: <Receipt className="w-4 h-4 text-indigo-500" /> },
    { label: t('coldChainRefrigeration'), value: costs.coldChainRefrigerationUsd, color: 'bg-sky-500', icon: <Thermometer className="w-4 h-4 text-sky-500" /> },
    { label: t('fleetRental'), value: costs.vehicleFleetRentalUsd, color: 'bg-emerald-500', icon: <Truck className="w-4 h-4 text-emerald-500" /> }
  ];

  const totalPayloadTons = selectedCargo.reduce((s, c) => s + c.weightTons, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Mission Cost Model & Ton-Kilometer Unit Economics
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Transparent, audit-ready operational expenditure accounting for fuel burn, security overhead, driver allowances, and cold-chain compliance.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-center flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
              Total Mission Outlay
            </span>
            <div className="text-2xl font-black text-emerald-800 dark:text-emerald-200">
              {'$' + costs.totalCostUsd.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-500 block">Unit Cost ($ / Ton-Km)</span>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
            {'$' + costs.costPerTonKm}
          </div>
          <span className="text-[11px] text-slate-400">Across {totalPayloadTons.toFixed(1)} tons & {calculatedRoute.totalDistanceKm} km</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-500 block">Active Fuel Baseline</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {'$' + (0.65 * activeShock.fuelPriceMultiplier).toFixed(2)} <span className="text-xs font-normal text-slate-400">/ Liter</span>
          </div>
          <span className="text-[11px] text-slate-400">Total Consumption: {calculatedRoute.totalFuelLiters} L</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-500 block">Security & Hazard Overhead</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {(((costs.securityEscortUsd + costs.driverRiskAllowanceUsd) / total) * 100).toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-400">{'$' + (costs.securityEscortUsd + costs.driverRiskAllowanceUsd).toLocaleString()} hazard expenditure</span>
        </div>
      </div>

      {/* Visual Multi-Segment Cost Waterfall Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Operational Expenditure Composition</span>
        </h3>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 shadow-inner">
          {costItems.map((item, idx) => {
            const pct = (item.value / total) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={idx}
                title={item.label + ': $' + item.value + ' (' + pct.toFixed(1) + '%)'}
                className={'h-full ' + item.color + ' transition-all hover:opacity-90'}
                style={{ width: pct + '%' }}
              />
            );
          })}
        </div>

        {/* Detailed Cost Line-Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {costItems.map((item, idx) => {
            const pct = ((item.value / total) * 100).toFixed(1);
            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{pct}% of total</span>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-slate-900 dark:text-white text-xs">
                  {'$' + item.value.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
