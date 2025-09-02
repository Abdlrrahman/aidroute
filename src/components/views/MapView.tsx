
import React from 'react';
import {
  Map,
  Truck,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building,
  Thermometer,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Hub, Corridor } from '../../types/logistics';

export const MapView: React.FC = () => {
  const {
    t,
    language,
    hubs,
    corridors,
    calculatedRoute,
    originHubId,
    setOriginHubId,
    destinationHubId,
    setDestinationHubId,
    isSimulating,
    simulationProgress,
    startSimulation,
    pauseSimulation,
    resetSimulation
  } = useApp();

  // Libya Map Bounds Projection (Lat: 23.5 to 33.5, Lng: 9.5 to 25.0)
  const mapWidth = 720;
  const mapHeight = 460;
  const minLng = 9.5;
  const maxLng = 24.8;
  const minLat = 23.5;
  const maxLat = 33.5;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 100) + 50;
    const y = mapHeight - (((lat - minLat) / (maxLat - minLat)) * (mapHeight - 100) + 50);
    return { x, y };
  };

  const getThreatColor = (level: Corridor['threatLevel'], isBlocked: boolean) => {
    if (isBlocked) return '#64748b'; // Gray for blocked
    switch (level) {
      case 'low': return '#10b981'; // Green
      case 'medium': return '#f59e0b'; // Amber
      case 'high': return '#ea580c'; // Orange
      case 'critical': return '#dc2626'; // Red
    }
  };

  const getConvoyPosition = () => {
    if (!calculatedRoute || calculatedRoute.pathHubIds.length < 2) return null;
    const pathHubs = calculatedRoute.pathHubIds.map(id => hubs.find(h => h.id === id)!).filter(Boolean);
    if (pathHubs.length < 2) return null;

    const totalSegments = pathHubs.length - 1;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor((simulationProgress / 100) * totalSegments));
    const segmentProgress = ((simulationProgress / 100) * totalSegments) - segmentIndex;

    const h1 = pathHubs[segmentIndex];
    const h2 = pathHubs[segmentIndex + 1];
    const p1 = project(h1.lat, h1.lng);
    const p2 = project(h2.lat, h2.lng);

    const x = p1.x + (p2.x - p1.x) * segmentProgress;
    const y = p1.y + (p2.y - p1.y) * segmentProgress;

    return { x, y, currentLeg: h1.name[language] + ' → ' + h2.name[language] };
  };

  const convoyPos = getConvoyPosition();

  return (
    <div className="space-y-6">
      {/* Top Controls & Dispatch Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Humanitarian Logistics Corridors & Real-Time Convoy Tracking
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Interactive Libyan logistics network showing road threat tiers, checkpoint densities, and active convoy progression.
            </p>
          </div>

          {/* Simulation Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {isSimulating ? (
              <button
                onClick={pauseSimulation}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow transition active:scale-95"
              >
                <Pause className="w-4 h-4" />
                <span>{t('pauseSimulation')}</span>
              </button>
            ) : (
              <button
                onClick={startSimulation}
                disabled={!calculatedRoute}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>{t('dispatchSimulation')}</span>
              </button>
            )}

            <button
              onClick={resetSimulation}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              title={t('resetSimulation')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden self-center">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-200"
                style={{ width: simulationProgress + '%' }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
              {simulationProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Map Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        {/* Map Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-emerald-500 rounded" /> Low Threat
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-amber-500 rounded" /> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-orange-500 rounded" /> High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-rose-600 rounded" /> Critical (Escort Req)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-slate-400 rounded stroke-dasharray" /> Blocked Road
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-amber-600">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white" /> Origin / Destination Hub
            </span>
            <span className="flex items-center gap-1 font-semibold text-sky-600">
              <span className="w-3 h-3 rounded-full bg-sky-500 border-2 border-white" /> Transit Depot
            </span>
          </div>
        </div>

        {/* SVG Geographic Map Canvas */}
        <div className="relative w-full aspect-[18/11] bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex items-center justify-center p-2">
          <svg
            className="w-full h-full"
            viewBox={'0 0 ' + mapWidth + ' ' + mapHeight}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Mediterranean Coastline Curve */}
            <path
              d="M 50 75 Q 160 85 240 105 T 420 160 T 560 110 T 680 135"
              fill="none"
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-800"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
            <text x="350" y="45" textAnchor="middle" className="text-[11px] font-bold fill-slate-400 uppercase tracking-widest">
              Mediterranean Sea (الـبـحـر الأبـيـض الـمـتـوسـط)
            </text>

            {/* Base Humanitarian Corridors */}
            {corridors.map((c) => {
              const h1 = hubs.find(h => h.id === c.fromHubId);
              const h2 = hubs.find(h => h.id === c.toHubId);
              if (!h1 || !h2) return null;

              const p1 = project(h1.lat, h1.lng);
              const p2 = project(h2.lat, h2.lng);
              const isPartOfRoute = calculatedRoute?.corridorIds.includes(c.id);
              const color = getThreatColor(c.threatLevel, c.isBlocked);

              return (
                <g key={c.id}>
                  {isPartOfRoute && (
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeOpacity="0.4"
                      strokeLinecap="round"
                    />
                  )}
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={color}
                    strokeWidth={isPartOfRoute ? '3.5' : '2'}
                    strokeDasharray={c.isBlocked ? '4 4' : c.roadQuality === 'desert_track' ? '2 2' : undefined}
                    strokeLinecap="round"
                    className="transition-all"
                  />
                </g>
              );
            })}

            {/* Hub Nodes */}
            {hubs.map((hub) => {
              const { x, y } = project(hub.lat, hub.lng);
              const isOrigin = hub.id === originHubId;
              const isDestination = hub.id === destinationHubId;
              const isEnRoute = calculatedRoute?.pathHubIds.includes(hub.id);

              return (
                <g
                  key={hub.id}
                  onClick={() => {
                    if (hub.id !== originHubId) {
                      setDestinationHubId(hub.id);
                    }
                  }}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  {(isOrigin || isDestination) && (
                    <circle
                      cx={x}
                      cy={y}
                      r="18"
                      fill="none"
                      stroke={isOrigin ? '#10b981' : '#f59e0b'}
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="animate-spin"
                    />
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r={hub.type === 'primary_hub' ? '9' : '6.5'}
                    fill={isOrigin ? '#10b981' : isDestination ? '#f59e0b' : isEnRoute ? '#38bdf8' : '#64748b'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    className={'text-[10px] font-bold ' + (
                      isOrigin ? 'fill-emerald-600 dark:fill-emerald-400 font-black' :
                      isDestination ? 'fill-amber-600 dark:fill-amber-400 font-black' :
                      'fill-slate-700 dark:fill-slate-300'
                    )}
                  >
                    {hub.name[language].split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Convoy Truck Marker during Simulation */}
            {convoyPos && (
              <g transform={'translate(' + (convoyPos.x - 12) + ',' + (convoyPos.y - 12) + ')'}>
                <rect width="24" height="24" rx="12" fill="#d97706" className="shadow-lg" />
                <circle cx="12" cy="12" r="16" fill="none" stroke="#d97706" strokeWidth="2" className="animate-ping" />
                <text x="12" y="16" textAnchor="middle" fill="#ffffff" fontSize="12">🚛</text>
              </g>
            )}
          </svg>
        </div>

        {/* Selected Route Summary Banner */}
        {calculatedRoute ? (
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                {calculatedRoute.pathHubIds.map(id => hubs.find(h => h.id === id)?.name[language].split(' ')[0]).join(' ➔ ')}
              </span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                {calculatedRoute.explanation[language]}
              </p>
            </div>

            <div className="flex items-center gap-4 font-mono font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Distance:</span>
                <span>{calculatedRoute.totalDistanceKm} km</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Est. Time:</span>
                <span className="text-amber-600">{calculatedRoute.totalTransitTimeHrs}h</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Mission Cost:</span>
                <span className="text-emerald-600">{'$' + calculatedRoute.costs.totalCostUsd.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-xs text-center font-semibold">
            No viable route found between selected origin and destination under active corridor blockades.
          </div>
        )}
      </div>
    </div>
  );
};
