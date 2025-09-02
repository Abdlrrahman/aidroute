import React, { useState, useEffect } from 'react';
import {
  Truck,
  Download,
  Copy,
  Check,
  X,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Thermometer,
  ShieldCheck,
  Fuel,
  Wind,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { broadcastMeshEvent } from '../../utils/meshBus';

interface ConvoySimulationLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SimulatedConvoy {
  id: string;
  callsign: string;
  type: string;
  origin: string;
  destination: string;
  cargo: string;
  totalDistanceKm: number;
  currentKm: number;
  speedKmh: number;
  status: 'en_route' | 'holding_checkpoint' | 'sandstorm_slowed' | 'arrived';
  temperatureC?: number;
  fuelConsumedLiters: number;
}

const INITIAL_CONVOYS: SimulatedConvoy[] = [
  {
    id: 'c-1',
    callsign: 'Convoy Echo-1 (Heavy 6x6)',
    type: 'Heavy Bulk Transport',
    origin: 'Tripoli Port Hub',
    destination: 'Sabha Regional Hospital',
    cargo: '28 Tons Wheat Flour & Emergency Rations',
    totalDistanceKm: 780,
    currentKm: 340,
    speedKmh: 65,
    status: 'en_route',
    fuelConsumedLiters: 156
  },
  {
    id: 'c-2',
    callsign: 'Reefer Bravo-4 (Cold-Chain)',
    type: 'Refrigerated 4x4',
    origin: 'Misrata Central Depot',
    destination: 'Sirte Primary Health Clinic',
    cargo: '4.5 Tons Pediatric Vaccines & Insulin',
    totalDistanceKm: 240,
    currentKm: 180,
    speedKmh: 75,
    status: 'en_route',
    temperatureC: 3.8,
    fuelConsumedLiters: 48
  },
  {
    id: 'c-3',
    callsign: 'Rapid Alpha-2 (Field Clinic)',
    type: 'Light Tactical Van',
    origin: 'Benghazi Logistics Hub',
    destination: 'Darnah Emergency Center',
    cargo: '2.2 Tons Blood Plasma & Trauma Surgical Kits',
    totalDistanceKm: 290,
    currentKm: 260,
    speedKmh: 80,
    status: 'en_route',
    temperatureC: 4.1,
    fuelConsumedLiters: 58
  },
  {
    id: 'c-4',
    callsign: 'Tanker Delta-3 (Water Bowzer)',
    type: '12,000L Potable Water',
    origin: 'Ghadames Oasis Depot',
    destination: 'Nalut Mountain Settlement',
    cargo: '12,000 Liters Tested Drinking Water',
    totalDistanceKm: 160,
    currentKm: 95,
    speedKmh: 50,
    status: 'en_route',
    fuelConsumedLiters: 52
  }
];

export const ConvoySimulationLabModal: React.FC<ConvoySimulationLabModalProps> = ({ isOpen, onClose }) => {
  const { calculatedRoute, hubs } = useApp();
  const [convoys, setConvoys] = useState<SimulatedConvoy[]>(INITIAL_CONVOYS);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isSandstormActive, setIsSandstormActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Simulation tick (progress convoys)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setConvoys(prev =>
        prev.map(convoy => {
          if (convoy.currentKm >= convoy.totalDistanceKm) {
            return { ...convoy, status: 'arrived', speedKmh: 0 };
          }

          const speed = isSandstormActive ? Math.min(30, convoy.speedKmh) : convoy.speedKmh;
          const progressInc = Math.round((speed * 0.05) * 10) / 10;
          const newKm = Math.min(convoy.totalDistanceKm, convoy.currentKm + progressInc);
          const fuelInc = Math.round((progressInc * (isSandstormActive ? 0.55 : 0.42)) * 10) / 10;

          // Temperature fluctuation
          let newTemp = convoy.temperatureC;
          if (newTemp !== undefined) {
            newTemp = isSandstormActive ? Math.min(6.8, newTemp + 0.1) : Math.max(3.2, newTemp + (Math.random() * 0.2 - 0.1));
            newTemp = Math.round(newTemp * 10) / 10;
          }

          return {
            ...convoy,
            currentKm: newKm,
            fuelConsumedLiters: Math.round(convoy.fuelConsumedLiters + fuelInc),
            temperatureC: newTemp,
            status: isSandstormActive ? 'sandstorm_slowed' : 'en_route'
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, isSandstormActive]);

  const toggleSandstorm = () => {
    const nextState = !isSandstormActive;
    setIsSandstormActive(nextState);

    broadcastMeshEvent({
      appId: 'aidroute',
      appName: 'AidRoute',
      type: nextState ? 'anomaly' : 'nominal',
      message: nextState
        ? 'METEOROLOGICAL ALERT: Ghibli sandstorm triggered; convoy maximum speed capped at 30 km/h'
        : 'WEATHER CLEARED: Desert visibility restored nominal along all southern relief corridors',
      metric: nextState ? '30 km/h Cap' : 'Nominal'
    });
  };

  const handleReset = () => {
    setConvoys(INITIAL_CONVOYS);
    setIsSandstormActive(false);
  };

  const handleCopy = () => {
    const summary = JSON.stringify({
      title: 'AidRoute Relief Convoy Active Field Simulation Report',
      timestamp: new Date().toISOString(),
      weatherAlert: isSandstormActive ? 'Ghibli Sandstorm Active (Speed Capped)' : 'Clear Desert Conditions',
      totalActiveUnits: convoys.length,
      convoys: convoys.map(c => ({
        callsign: c.callsign,
        route: `${c.origin} -> ${c.destination}`,
        progress: `${c.currentKm} / ${c.totalDistanceKm} km (${Math.round((c.currentKm / c.totalDistanceKm) * 100)}%)`,
        cargo: c.cargo,
        fuelConsumed: `${c.fuelConsumedLiters} Liters`,
        temperatureColdChain: c.temperatureC ? `${c.temperatureC}°C` : 'N/A'
      }))
    }, null, 2);

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    broadcastMeshEvent({
      appId: 'aidroute',
      appName: 'AidRoute',
      type: 'nominal',
      message: `Convoy field telemetry copied: ${convoys.length} vehicles active in transit`,
      metric: 'Telemetry'
    });
  };

  const handleDownload = () => {
    const data = {
      meta: {
        system: 'AidRoute Humanitarian Logistics Convoy Control Tower',
        timestamp: new Date().toISOString(),
        weatherCondition: isSandstormActive ? 'Sandstorm' : 'Clear'
      },
      convoys
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aidroute-convoy-simulation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    broadcastMeshEvent({
      appId: 'aidroute',
      appName: 'AidRoute',
      type: 'nominal',
      message: `Tactical convoy telemetry log exported: ${a.download}`,
      metric: 'Mission Log'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Real-Time Convoy Movement & Cold-Chain Telemetry Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
                  TACTICAL NOC
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live step-by-step desert dispatch ticker with fuel burn, sandstorm triggers, and thermal logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-press px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Telemetry'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="btn-press px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Log</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tactical Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-2xl bg-slate-950 text-white text-xs font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="btn-press px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Ticker' : 'Resume Ticker'}</span>
            </button>

            <button
              onClick={toggleSandstorm}
              className={`btn-press px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 border transition ${
                isSandstormActive
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>{isSandstormActive ? 'Sandstorm Active (30 km/h)' : 'Inject Sandstorm'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Total Fuel: <strong className="text-amber-400">{convoys.reduce((sum, c) => sum + c.fuelConsumedLiters, 0)} L</strong></span>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Convoys Live Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {convoys.map(convoy => {
            const percent = Math.min(100, Math.round((convoy.currentKm / convoy.totalDistanceKm) * 100));
            const isColdChain = convoy.temperatureC !== undefined;
            const isTempCritical = convoy.temperatureC && (convoy.temperatureC > 6.0 || convoy.temperatureC < 2.0);

            return (
              <div
                key={convoy.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-500" />
                      <span>{convoy.callsign}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {convoy.cargo}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    convoy.status === 'arrived' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                    convoy.status === 'sandstorm_slowed' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {convoy.status === 'sandstorm_slowed' ? 'Sandstorm Slowed' : convoy.status === 'arrived' ? 'Arrived Destination' : 'En Route'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">{convoy.origin} → {convoy.destination}</span>
                    <strong className="text-slate-900 dark:text-white">{percent}% ({Math.round(convoy.currentKm)} / {convoy.totalDistanceKm} km)</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        percent >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry Row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Speed</span>
                    <strong className="text-slate-800 dark:text-slate-200">{convoy.speedKmh} km/h</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fuel Burn</span>
                    <strong className="text-slate-800 dark:text-slate-200">{convoy.fuelConsumedLiters} L</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reefer Sensor</span>
                    {isColdChain ? (
                      <strong className={isTempCritical ? 'text-rose-500 flex items-center gap-0.5' : 'text-emerald-500 flex items-center gap-0.5'}>
                        <Thermometer className="w-3 h-3" />
                        <span>{convoy.temperatureC}°C</span>
                      </strong>
                    ) : (
                      <span className="text-slate-400">Ambient</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

