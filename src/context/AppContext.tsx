import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Language,
  TabId,
  Hub,
  Corridor,
  Vehicle,
  CargoItem,
  OptimizationGoal,
  CalculatedRoute,
  ShockScenario
} from '../types/logistics';
import { seedHubs, seedCorridors, seedVehicles, seedCargoItems, seedShocks } from '../data/seedLogistics';
import { findOptimalRoute } from '../engine/routeOptimization';
import { translations } from '../i18n/translations';

interface AppContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  
  hubs: Hub[];
  addHub: (h: Hub) => void;
  corridors: Corridor[];
  addCorridor: (c: Corridor) => void;
  vehicles: Vehicle[];
  cargoItems: CargoItem[];
  addCargoItem: (c: Omit<CargoItem, 'id'>) => void;
  deleteCargoItem: (id: string) => void;
  shocks: ShockScenario[];
  
  originHubId: string;
  setOriginHubId: (id: string) => void;
  destinationHubId: string;
  setDestinationHubId: (id: string) => void;
  optimizationGoal: OptimizationGoal;
  setOptimizationGoal: (g: OptimizationGoal) => void;
  activeShockId: string;
  setActiveShockId: (id: string) => void;

  toggleCargoItem: (id: string) => void;
  toggleCorridorBlock: (id: string) => void;
  resetAll: () => void;
  clearToBlankMission: () => void;
  loadDemoMission: () => void;
  importWaypointsCsv: (csvText: string) => number;

  calculatedRoute: CalculatedRoute | null;
  activeShock: ShockScenario;
  selectedCargo: CargoItem[];

  isSimulating: boolean;
  simulationProgress: number; // 0 to 100
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  exportRouteCsv: () => string;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isLocked: boolean;
  switchRole: (role: UserRole) => void;
  lockSession: () => void;
  unlockSession: (pin: string) => boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_HUBS_KEY = 'aidroute_hubs_v1';
const STORAGE_CORRIDORS_KEY = 'aidroute_corridors_v1';
const STORAGE_CARGO_KEY = 'aidroute_cargo_v1';
const THEME_STORAGE_KEY = 'aidroute_theme_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to sync theme classes:', e);
    }
  }, [darkMode]);

  const [activeTab, setActiveTab] = useState<TabId>('map');

  const [hubs, setHubs] = useState<Hub[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HUBS_KEY);
      return saved ? JSON.parse(saved) : seedHubs;
    } catch {
      return seedHubs;
    }
  });

  const [corridors, setCorridors] = useState<Corridor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CORRIDORS_KEY);
      return saved ? JSON.parse(saved) : seedCorridors;
    } catch {
      return seedCorridors;
    }
  });

  const [vehicles] = useState<Vehicle[]>(seedVehicles);

  const [cargoItems, setCargoItems] = useState<CargoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CARGO_KEY);
      return saved ? JSON.parse(saved) : seedCargoItems;
    } catch {
      return seedCargoItems;
    }
  });

  const [shocks] = useState<ShockScenario[]>(seedShocks);

  const addHub = useCallback((newHub: Hub) => {
    setHubs(prev => {
      const updated = [...prev, newHub];
      try { localStorage.setItem(STORAGE_HUBS_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const addCorridor = useCallback((newCorridor: Corridor) => {
    setCorridors(prev => {
      const updated = [...prev, newCorridor];
      try { localStorage.setItem(STORAGE_CORRIDORS_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const addCargoItem = useCallback((item: Omit<CargoItem, 'id'>) => {
    const newItem: CargoItem = {
      ...item,
      id: 'cargo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    setCargoItems(prev => {
      const updated = [newItem, ...prev];
      try { localStorage.setItem(STORAGE_CARGO_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const deleteCargoItem = useCallback((id: string) => {
    setCargoItems(prev => {
      const updated = prev.filter(c => c.id !== id);
      try { localStorage.setItem(STORAGE_CARGO_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clearToBlankMission = useCallback(() => {
    setCargoItems([]);
    try { localStorage.setItem(STORAGE_CARGO_KEY, JSON.stringify([])); } catch {}
  }, []);

  const loadDemoMission = useCallback(() => {
    setHubs(seedHubs);
    setCorridors(seedCorridors);
    setCargoItems(seedCargoItems);
    try {
      localStorage.setItem(STORAGE_HUBS_KEY, JSON.stringify(seedHubs));
      localStorage.setItem(STORAGE_CORRIDORS_KEY, JSON.stringify(seedCorridors));
      localStorage.setItem(STORAGE_CARGO_KEY, JSON.stringify(seedCargoItems));
    } catch {}
  }, []);

  const importWaypointsCsv = useCallback((csvText: string): number => {
    const lines = csvText.trim().split('\n');
    let importedCount = 0;
    const newItems: CargoItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 3) {
        const name = parts[0] || 'Relief Batch';
        const weight = parseFloat(parts[1]) || 5;
        const cat = (parts[2] as any) || 'food';
        const coldChain = parts[3]?.toLowerCase() === 'true' || parts[3] === '1';

        newItems.push({
          id: 'cargo_imp_' + Date.now() + '_' + i,
          name: { en: name, ar: name },
          weightTons: weight,
          category: cat,
          priority: 'high',
          requiresRefrigeration: coldChain,
          selected: true
        });
        importedCount++;
      }
    }

    if (newItems.length > 0) {
      setCargoItems(prev => {
        const updated = [...newItems, ...prev];
        try { localStorage.setItem(STORAGE_CARGO_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
    return importedCount;
  }, []);

  const [originHubId, setOriginHubId] = useState<string>('misrata');
  const [destinationHubId, setDestinationHubId] = useState<string>('ghat');
  const [optimizationGoal, setOptimizationGoal] = useState<OptimizationGoal>('balanced');
  const [activeShockId, setActiveShockId] = useState<string>('baseline');

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);

  const t = useCallback((key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  }, [language]);

  const toggleCargoItem = useCallback((id: string) => {
    setCargoItems(items => items.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  }, []);

  const toggleCorridorBlock = useCallback((id: string) => {
    setCorridors(list => list.map(c => c.id === id ? { ...c, isBlocked: !c.isBlocked } : c));
  }, []);

  const resetAll = useCallback(() => {
    setCorridors(seedCorridors);
    setCargoItems(seedCargoItems);
    setOriginHubId('misrata');
    setDestinationHubId('ghat');
    setOptimizationGoal('balanced');
    setActiveShockId('baseline');
    setSimulationProgress(0);
    setIsSimulating(false);
  }, []);

  const activeShock = useMemo(() => {
    return shocks.find(s => s.id === activeShockId) || shocks[0];
  }, [shocks, activeShockId]);

  const selectedCargo = useMemo(() => {
    return cargoItems.filter(c => c.selected);
  }, [cargoItems]);

  const calculatedRoute = useMemo(() => {
    return findOptimalRoute(
      originHubId,
      destinationHubId,
      hubs,
      corridors,
      vehicles,
      selectedCargo,
      optimizationGoal,
      activeShock
    );
  }, [originHubId, destinationHubId, hubs, corridors, vehicles, selectedCargo, optimizationGoal, activeShock]);

  // Simulation controls
  const startSimulation = useCallback(() => {
    setIsSimulating(true);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setSimulationProgress(0);
  }, []);

  // Timer for convoy animation
  React.useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSimulationProgress(p => {
        if (p >= 100) {
          setIsSimulating(false);
          return 100;
        }
        return p + 2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const exportRouteCsv = useCallback(() => {
    if (!calculatedRoute) return;
    const headers = ['Segment', 'From Hub', 'To Hub', 'Distance (km)', 'Road Quality', 'Threat Level', 'Checkpoints'];
    const rows: string[][] = [];

    for (let i = 0; i < calculatedRoute.pathHubIds.length - 1; i++) {
      const fromId = calculatedRoute.pathHubIds[i];
      const toId = calculatedRoute.pathHubIds[i + 1];
      const fromHub = hubs.find(h => h.id === fromId)?.name[language] || fromId;
      const toHub = hubs.find(h => h.id === toId)?.name[language] || toId;
      const corr = corridors.find(c =>
        (c.fromHubId === fromId && c.toHubId === toId) ||
        (c.fromHubId === toId && c.toHubId === fromId)
      );

      rows.push([
        (i + 1).toString(),
        '"' + fromHub + '"',
        '"' + toHub + '"',
        corr ? corr.distanceKm.toString() : 'N/A',
        corr ? corr.roadQuality : 'N/A',
        corr ? corr.threatLevel : 'N/A',
        corr ? corr.checkpointsCount.toString() : 'N/A'
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'aidroute_plan_' + originHubId + '_to_' + destinationHubId + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [calculatedRoute, hubs, corridors, language, originHubId, destinationHubId]);

  const value: AppContextValue = {
    language,
    setLanguage,
    t,
    darkMode,
    toggleDarkMode,
    activeTab,
    setActiveTab,
    hubs,
    corridors,
    vehicles,
    cargoItems,
    shocks,
    originHubId,
    setOriginHubId,
    destinationHubId,
    setDestinationHubId,
    optimizationGoal,
    setOptimizationGoal,
    activeShockId,
    setActiveShockId,
    toggleCargoItem,
    toggleCorridorBlock,
    resetAll,
    calculatedRoute,
    activeShock,
    selectedCargo,
    isSimulating,
    simulationProgress,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    exportRouteCsv
  };

  return (
    <AppContext.Provider value={value}>
      <div className={darkMode ? 'dark' : ''} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
          {children}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
