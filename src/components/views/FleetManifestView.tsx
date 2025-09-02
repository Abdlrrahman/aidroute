
import React from 'react';
import {
  Package,
  Truck,
  CheckSquare,
  Square,
  Thermometer,
  ShieldCheck,
  Fuel,
  Weight,
  Box
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FleetManifestView: React.FC = () => {
  const {
    language,
    cargoItems,
    toggleCargoItem,
    vehicles,
    selectedCargo
  } = useApp();

  const totalWeight = selectedCargo.reduce((s, c) => s + c.weightTons, 0);
  const totalVolume = selectedCargo.reduce((s, c) => s + c.volumeM3, 0);
  const hasColdChain = selectedCargo.some(c => c.requiresColdChain);

  return (
    <div className="space-y-6">
      {/* Top Tally Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-500 block">Total Selected Payload</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalWeight.toFixed(1)} <span className="text-xs font-normal text-slate-400">Metric Tons</span>
          </div>
          <span className="text-[11px] text-slate-400">{totalVolume.toFixed(1)} m³ Cubic Volume</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-500 block">Cold-Chain Requirement</span>
          <div className={'text-2xl font-black mt-1 ' + (hasColdChain ? 'text-sky-600' : 'text-slate-400')}>
            {hasColdChain ? 'Active (2°C - 8°C)' : 'Dry Cargo Only'}
          </div>
          <span className="text-[11px] text-slate-400">
            {hasColdChain ? 'Refrigerated Reefer Carrier Required' : 'Standard flatbed/semi-trailer'}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-500 block">Available Fleet Inventory</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {vehicles.length} Vehicle Classes
          </div>
          <span className="text-[11px] text-slate-400">Multi-modal road transport</span>
        </div>
      </div>

      {/* Cargo Manifest Selection Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            <span>Humanitarian Cargo Item Manifest</span>
          </h3>
          <span className="text-xs text-slate-500">
            Toggle checkboxes to customize convoy payload
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 w-12 text-center">Select</th>
                <th className="px-4 py-3">Cargo Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Weight (Tons)</th>
                <th className="px-4 py-3">Volume (m³)</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Cold-Chain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {cargoItems.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => toggleCargoItem(c.id)}
                  className={'cursor-pointer transition ' + (
                    c.selected ? 'bg-amber-50/40 dark:bg-amber-950/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                  )}
                >
                  <td className="px-4 py-3 text-center">
                    {c.selected ? (
                      <CheckSquare className="w-4 h-4 text-amber-600 mx-auto" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {c.name[language]}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-400">
                    {c.category.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-800 dark:text-slate-200">
                    {c.weightTons} t
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                    {c.volumeM3} m³
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (
                        c.priority === 'critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        c.priority === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      )}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.requiresColdChain ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-sky-600">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>{c.targetTempCelsius}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Dry Ambient</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Vehicles Catalog */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-500" />
          <span>Fleet Vehicle Specifications & Operating Rates</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  {v.name[language]}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">{v.type.replace('_', ' ')}</span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Payload:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{v.payloadTons} Tons</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Consumption:</span>
                  <span className="font-mono">{v.fuelConsumptionLitersPer100Km} L/100km</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Rental:</span>
                  <span className="font-mono text-emerald-600 font-bold">{'$' + v.dailyRateUsd}/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold-Chain:</span>
                  <span className={v.isColdChainEquipped ? 'text-sky-600 font-bold' : 'text-slate-400'}>
                    {v.isColdChainEquipped ? 'Yes (Active Reefer)' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
