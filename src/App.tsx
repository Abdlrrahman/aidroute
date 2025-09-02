
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { NavTabs } from './components/layout/NavTabs';
import { MapView } from './components/views/MapView';
import { RoutePlannerView } from './components/views/RoutePlannerView';
import { FleetManifestView } from './components/views/FleetManifestView';
import { CostModelView } from './components/views/CostModelView';
import { ShockLabView } from './components/views/ShockLabView';
import { MethodologyView } from './components/views/MethodologyView';
import { AuthLockModal } from './components/auth/AuthLockModal';
import { Truck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activeTab === 'map' && <MapView />}
      {activeTab === 'planner' && <RoutePlannerView />}
      {activeTab === 'fleet' && <FleetManifestView />}
      {activeTab === 'cost' && <CostModelView />}
      {activeTab === 'shocks' && <ShockLabView />}
      {activeTab === 'methodology' && <MethodologyView />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <NavTabs />
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">AidRoute v1.0.0</span>
              <span>— Humanitarian Last-Mile Logistics Simulator</span>
            </div>
            <div>
              Built by <strong className="text-slate-800 dark:text-slate-200">Abdlrrahman Shibani</strong>
            </div>
          </div>
        </footer>
      </div>
      <AuthLockModal />
    </AppProvider>
  );
};

export default App;
