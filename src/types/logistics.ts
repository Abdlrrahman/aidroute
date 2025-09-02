
export type Language = 'en' | 'ar';

export type HubType = 'primary_hub' | 'secondary_hub' | 'distribution_point' | 'border_post';
export type RoadQuality = 'paved' | 'partially_degraded' | 'desert_track';
export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';
export type VehicleType = 'heavy_40t' | 'medium_10t' | 'offroad_unimog' | 'reefer_coldchain';
export type CargoCategory = 'medical_kits' | 'coldchain_vaccines' | 'emergency_food' | 'water_purification' | 'shelter_tents';
export type OptimizationGoal = 'balanced' | 'fastest' | 'safest' | 'cheapest' | 'coldchain';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Hub {
  id: string;
  name: LocalizedString;
  region: 'western' | 'eastern' | 'central' | 'southern';
  type: HubType;
  lat: number;
  lng: number;
  warehouseCapacityTons: number;
  currentStockTons: number;
  fuelDepotAvailable: boolean;
}

export interface Corridor {
  id: string;
  fromHubId: string;
  toHubId: string;
  distanceKm: number;
  roadQuality: RoadQuality;
  threatLevel: ThreatLevel;
  baseSpeedKmh: number;
  checkpointsCount: number;
  avgCheckpointDelayHrs: number;
  escortRequired: boolean;
  tollFeeUsd: number;
  isBlocked: boolean;
}

export interface Vehicle {
  id: string;
  name: LocalizedString;
  type: VehicleType;
  payloadTons: number;
  volumeM3: number;
  fuelConsumptionLitersPer100Km: number;
  isColdChainEquipped: boolean;
  dailyRateUsd: number;
  driverDangerAllowancePerKm: number;
}

export interface CargoItem {
  id: string;
  name: LocalizedString;
  category: CargoCategory;
  weightTons: number;
  volumeM3: number;
  priority: 'critical' | 'high' | 'medium';
  requiresColdChain: boolean;
  targetTempCelsius?: string;
  maxExcursionHours?: number;
  selected: boolean;
}

export interface RouteCostBreakdown {
  fuelCostUsd: number;
  driverRiskAllowanceUsd: number;
  securityEscortUsd: number;
  tollsAndClearanceUsd: number;
  coldChainRefrigerationUsd: number;
  vehicleFleetRentalUsd: number;
  totalCostUsd: number;
  costPerTonKm: number;
}

export interface CalculatedRoute {
  pathHubIds: string[];
  totalDistanceKm: number;
  totalTransitTimeHrs: number;
  totalFuelLiters: number;
  overallThreatScore: number; // 0-100
  coldChainRisk: 'safe' | 'warning' | 'critical_excursion';
  costs: RouteCostBreakdown;
  checkpointsPassed: number;
  explanation: LocalizedString;
  corridorIds: string[];
}

export interface ShockScenario {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  blockedCorridorIds: string[];
  fuelPriceMultiplier: number;
  threatMultiplier: number;
  checkpointDelayMultiplier: number;
}

export type TabId = 'map' | 'planner' | 'fleet' | 'cost' | 'shocks' | 'methodology';
