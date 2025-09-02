import React from 'react';
import {
  Map,
  Compass,
  Package,
  DollarSign,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { TabId } from '../../types/logistics';
import clsx from 'clsx';

export const NavTabs: React.FC = () => {
  const { activeTab, setActiveTab, t, activeShock } = useApp();

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'map', label: t('tabMap'), icon: <Map className="w-4 h-4" /> },
    { id: 'planner', label: t('tabPlanner'), icon: <Compass className="w-4 h-4" /> },
    { id: 'fleet', label: t('tabFleet'), icon: <Package className="w-4 h-4" /> },
    { id: 'cost', label: t('tabCost'), icon: <DollarSign className="w-4 h-4" /> },
    { id: 'shocks', label: t('tabShocks'), icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'methodology', label: t('tabMethodology'), icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md overflow-x-auto sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1.5 py-2 min-w-max">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'btn-press flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative',
              activeTab === tab.id
                ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.id === 'shocks' && activeShock.id !== 'baseline' && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
