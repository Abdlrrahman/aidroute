import React, { useState } from 'react';
import {
  PackagePlus,
  Truck,
  MapPin,
  FileSpreadsheet,
  X,
  Trash2,
  CheckCircle2,
  ThermometerSnowflake,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LogisticsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogisticsManagerModal: React.FC<LogisticsManagerModalProps> = ({ isOpen, onClose }) => {
  const {
    cargoItems,
    addCargoItem,
    deleteCargoItem,
    clearToBlankMission,
    loadDemoMission,
    importWaypointsCsv
  } = useApp();

  const [activeTab, setActiveTab] = useState<'add_cargo' | 'import_csv' | 'manage'>('add_cargo');

  // Add Cargo Form
  const [cargoName, setCargoName] = useState('');
  const [weightTons, setWeightTons] = useState<number>(8);
  const [category, setCategory] = useState<'medical' | 'food' | 'water' | 'shelter' | 'fuel'>('medical');
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium'>('high');
  const [isColdChain, setIsColdChain] = useState<boolean>(true);

  // CSV Feedback
  const [csvFeedback, setCsvFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddCargo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cargoName.trim()) return;

    addCargoItem({
      name: { en: cargoName, ar: cargoName },
      weightTons: Number(weightTons),
      category,
      priority,
      requiresRefrigeration: isColdChain,
      selected: true
    });

    setCargoName('');
    setActiveTab('manage');
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        try {
          const count = importWaypointsCsv(text);
          setCsvFeedback(`Successfully imported ${count} relief cargo line items.`);
        } catch {
          setCsvFeedback('Failed to parse CSV format. Expected: Name,Weight,Category,RequiresColdChain');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Humanitarian Fleet & Cargo Management
              </h3>
              <p className="text-xs text-slate-500">
                Define real relief supply batches, cold-chain constraints, or import operational manifests.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('add_cargo')}
            className={'flex-1 py-1.5 rounded-xl text-xs font-bold transition ' + (activeTab === 'add_cargo' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}
          >
            + Add Relief Cargo
          </button>
          <button
            onClick={() => setActiveTab('import_csv')}
            className={'flex-1 py-1.5 rounded-xl text-xs font-bold transition ' + (activeTab === 'import_csv' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}
          >
            Import CSV Manifest
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={'flex-1 py-1.5 rounded-xl text-xs font-bold transition ' + (activeTab === 'manage' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}
          >
            Manage Cargo ({cargoItems.length})
          </button>
        </div>

        {/* 1. Add Cargo Form */}
        {activeTab === 'add_cargo' && (
          <form onSubmit={handleAddCargo} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cargo Batch Name:</label>
                <input
                  type="text"
                  required
                  value={cargoName}
                  onChange={(e) => setCargoName(e.target.value)}
                  placeholder="e.g. Pediatric Polio Vaccines"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Weight (Metric Tons):</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={weightTons}
                  onChange={(e) => setWeightTons(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="medical">Medical Supplies</option>
                  <option value="food">High-Energy Food</option>
                  <option value="water">Clean Water Purification</option>
                  <option value="shelter">Emergency Tents</option>
                  <option value="fuel">Generator Diesel Fuel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mission Priority:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="critical">Critical (Priority 1)</option>
                  <option value="high">High (Priority 2)</option>
                  <option value="medium">Standard (Priority 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cold-Chain Protection:</label>
                <button
                  type="button"
                  onClick={() => setIsColdChain(prev => !prev)}
                  className={'w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border ' + (isColdChain ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300' : 'border-slate-200 dark:border-slate-700 text-slate-500')}
                >
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>{isColdChain ? 'Required (2-8°C)' : 'Ambient'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-press w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20"
            >
              Add Cargo to Active Fleet Manifest
            </button>
          </form>
        )}

        {/* 2. CSV Import Tab */}
        {activeTab === 'import_csv' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                <span>Relief Manifest CSV Format</span>
              </span>
              <p className="text-[11px] text-slate-500 font-mono">
                Headers: Description,WeightTons,Category,RequiresRefrigeration<br />
                Example: Trauma Surgical Kits,4.5,medical,true
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Upload Manifest CSV:
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-950 dark:file:text-amber-300 cursor-pointer"
              />
            </div>

            {csvFeedback && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{csvFeedback}</span>
              </div>
            )}
          </div>
        )}

        {/* 3. Manage Cargo Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-500">Active Supply Items ({cargoItems.length})</span>
              <div className="flex gap-2">
                <button
                  onClick={clearToBlankMission}
                  className="btn-press px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-[11px] font-bold border border-rose-200 dark:border-rose-800"
                >
                  Clear to Blank Mission
                </button>
                <button
                  onClick={loadDemoMission}
                  className="btn-press px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold"
                >
                  Load Demo Template
                </button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {cargoItems.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{c.name.en}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.category} • {c.priority} {c.requiresRefrigeration ? '• ❄️ Cold-Chain' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      {c.weightTons} Tons
                    </span>
                    <button
                      onClick={() => deleteCargoItem(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
