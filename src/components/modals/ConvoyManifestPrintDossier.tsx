import React from 'react';
import { Printer, X, Truck, FileText, Download, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ConvoyManifestPrintDossierProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConvoyManifestPrintDossier: React.FC<ConvoyManifestPrintDossierProps> = ({ isOpen, onClose }) => {
  const {
    currentRoute,
    cargoItems,
    hubs,
    totalCargoTons,
    currentUser
  } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const originHub = hubs.find(h => h.id === currentRoute?.originId);
  const destHub = hubs.find(h => h.id === currentRoute?.destinationId);

  const handleDownloadJson = () => {
    const data = {
      meta: {
        system: 'AidRoute UNDSS Convoy Movement Order & Manifest',
        timestamp: new Date().toISOString(),
        author: currentUser.name,
        role: currentUser.role
      },
      mission: {
        origin: originHub?.name.en,
        destination: destHub?.name.en,
        distanceKm: currentRoute?.totalDistanceKm,
        durationHours: currentRoute?.estimatedHours,
        fuelLiters: currentRoute?.fuelRequiredLiters,
        co2Kg: currentRoute?.co2Kg,
        riskScore: currentRoute?.riskScore
      },
      cargoItems,
      totalCargoTons
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AIDROUTE_CONVOY_MANIFEST_' + Date.now() + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
        {/* Action Controls (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Humanitarian Convoy Movement Order & Cargo Manifest
              </h3>
              <p className="text-xs text-slate-500">
                Official operational dispatch order formatted for UNDSS convoy security and PDF export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-press px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="btn-press px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Signed JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:border-0 print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-700">
                UN LOGISTICS CLUSTER • CONVOY DISPATCH & SECURITY CLEARANCE ORDER
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Convoy Movement Order: {originHub?.name.en || 'Hub Alpha'} → {destHub?.name.en || 'Destination'}
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Relief Fleet: <strong>Heavy All-Terrain 6x6 Fleet</strong> | Total Payload: <strong>{totalCargoTons} Metric Tons</strong>
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded font-mono text-xs font-bold">
                CLEARANCE GRANTED
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Dispatch Date: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Section 1: Route Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Distance</span>
              <span className="text-base font-black font-mono text-slate-900">{currentRoute?.totalDistanceKm || 680} km</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated Transit</span>
              <span className="text-base font-black font-mono text-amber-700">{currentRoute?.estimatedHours || 11.5} hrs</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Diesel Fuel Req</span>
              <span className="text-base font-black font-mono text-slate-900">{currentRoute?.fuelRequiredLiters || 285} L</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">CO2 Footprint</span>
              <span className="text-base font-black font-mono text-emerald-700">{Math.round(currentRoute?.co2Kg || 760)} kg</span>
            </div>
          </div>

          {/* Section 2: Security Assessment */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>UNDSS Security Escort Directive & Checkpoint Protocol</span>
            </span>
            <p className="text-xs text-amber-950 leading-relaxed">
              Convoy authorized under Level 2 UN armed security escort. Mandatory VHF radio check-in at 50-kilometer interval waypoints. Satellite transponders must maintain active tracking across southern desert corridors.
            </p>
          </div>

          {/* Section 3: Cargo Consignment Manifest */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-700 border-b border-slate-200 pb-1">
              Consignment Cargo Manifest ({cargoItems.length} Consignments)
            </h4>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-mono text-[10px]">
                  <th className="py-1.5">BATCH ID</th>
                  <th className="py-1.5">CONSIGNMENT DESCRIPTION</th>
                  <th className="py-1.5">PRIORITY</th>
                  <th className="py-1.5">WEIGHT (TONS)</th>
                  <th className="py-1.5 text-right">COLD-CHAIN (2-8°C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {cargoItems.map(item => (
                  <tr key={item.id}>
                    <td className="py-1 text-slate-500">{item.id}</td>
                    <td className="py-1 font-medium font-sans text-slate-800">{item.name.en}</td>
                    <td className="py-1 uppercase text-[10px]">{item.priority}</td>
                    <td className="py-1 font-bold">{item.weightTons} T</td>
                    <td className="py-1 text-right">
                      {item.requiresColdChain ? (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                          2°C - 8°C CRITICAL
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Ambient</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Humanitarian Logistics Director</span>
              <p className="font-bold text-slate-900 mt-1">Abdlrrahman Shibani</p>
              <p className="text-[10px] text-slate-500">Level 4 Sovereign Stack Architect</p>
              <div className="h-0.5 bg-slate-300 w-48 mt-4" />
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Convoy Commander Sign-Off</span>
              <p className="font-bold text-slate-900 mt-1">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500">{currentUser.organization} • {currentUser.role}</p>
              <div className="h-0.5 bg-slate-300 w-48 mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
