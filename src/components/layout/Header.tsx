import React, { useState } from 'react';
import {
  Truck,
  Globe,
  Sun,
  Moon,
  RotateCcw,
  Download,
  AlertTriangle,
  Zap,
  PackagePlus,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthUserMenu } from '../auth/AuthUserMenu';
import { AppSwitcher } from './AppSwitcher';
import { AuditTrailModal } from '../audit/AuditTrailModal';
import { LogisticsManagerModal } from '../modals/LogisticsManagerModal';
import { ConvoyManifestPrintDossier } from '../modals/ConvoyManifestPrintDossier';
import { GpxKmlExportModal } from '../modals/GpxKmlExportModal';
import { ConvoySimulationLabModal } from '../modals/ConvoySimulationLabModal';
import { Printer, Navigation, Radio } from 'lucide-react';

export const Header: React.FC = () => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isLogisticsModalOpen, setIsLogisticsModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isGpxModalOpen, setIsGpxModalOpen] = useState(false);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const {
    t,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    resetAll,
    activeShock,
    calculatedRoute,
    exportRouteCsv
  } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      {/* Synthetic Demo Banner */}
      <div className="bg-amber-500/10 dark:bg-amber-500/20 border-b border-amber-500/20 px-4 py-1 text-center text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center justify-center gap-1.5">
        <Zap className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{t('demoNotice')}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <AppSwitcher />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md text-white flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {t('appTitle')}
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Logistics Lab
              </span>
              {activeShock.id !== 'baseline' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{activeShock.name[language]}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('appTagline')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Route KPI Badges */}
          {calculatedRoute && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <span className="text-slate-500">{t('totalDistance')}:</span>
              <span className="font-mono text-slate-900 dark:text-white">{calculatedRoute.totalDistanceKm} km</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-500">{t('transitTime')}:</span>
              <span className="font-mono text-amber-600">{calculatedRoute.totalTransitTimeHrs}h</span>
            </div>
          )}

          {/* Logistics Manager & Manifest Import Button */}
          <button
            onClick={() => setIsLogisticsModalOpen(true)}
            className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm shadow-amber-600/20"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>+ Relief Cargo</span>
          </button>

          {/* Convoy Movement Order & Manifest Dossier */}
          <button
            onClick={() => setIsDossierOpen(true)}
            title="Convoy Movement Order & Manifest Dossier"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-amber-500" />
            <span>Dossier / PDF</span>
          </button>

          {/* GPX / KML Geospatial Export */}
          <button
            onClick={() => setIsGpxModalOpen(true)}
            disabled={!calculatedRoute}
            title="Export Tactical GPX / KML / GeoJSON Mission Waypoints"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition active:scale-95 disabled:opacity-50"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>GPX / GPS</span>
          </button>

          {/* Real-Time Convoy Simulation Lab */}
          <button
            onClick={() => setIsSimModalOpen(true)}
            title="Real-Time Desert Convoy Movement & Cold-Chain Telemetry Simulator"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/60 text-xs font-bold text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 text-orange-500" />
            <span>Convoy Sim</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={exportRouteCsv}
            disabled={!calculatedRoute}
            title={t('exportCsv')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Audit Trail Button */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            title="Institutional Audit Trail"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Audit</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={resetAll}
            title={t('resetShock')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'العربية (RTL)' : 'English (LTR)'}</span>
          </button>

          {/* Auth User Menu */}
          <AuthUserMenu />
        </div>
      </div>
      <AuditTrailModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
      <LogisticsManagerModal isOpen={isLogisticsModalOpen} onClose={() => setIsLogisticsModalOpen(false)} />
      <ConvoyManifestPrintDossier isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} />
      <GpxKmlExportModal isOpen={isGpxModalOpen} onClose={() => setIsGpxModalOpen(false)} />
      <ConvoySimulationLabModal isOpen={isSimModalOpen} onClose={() => setIsSimModalOpen(false)} />
    </header>
  );
};
