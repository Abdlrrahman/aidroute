
import type { Hub, Corridor, Vehicle, CargoItem, ShockScenario } from '../types/logistics';

export const seedHubs: Hub[] = [
  {
    id: 'tripoli',
    name: { en: 'Tripoli Central Logistics Base', ar: 'قاعدة طرابلس اللوجستية المركزية' },
    region: 'western',
    type: 'primary_hub',
    lat: 32.8872,
    lng: 13.1913,
    warehouseCapacityTons: 5000,
    currentStockTons: 3420,
    fuelDepotAvailable: true
  },
  {
    id: 'misrata',
    name: { en: 'Misrata Port Humanitarian Hub', ar: 'مركز ميناء مصراتة الإنساني' },
    region: 'western',
    type: 'primary_hub',
    lat: 32.3754,
    lng: 15.0925,
    warehouseCapacityTons: 6500,
    currentStockTons: 4800,
    fuelDepotAvailable: true
  },
  {
    id: 'sirte',
    name: { en: 'Sirte Central Transit Depot', ar: 'مستودع سرت المركزي للعبور' },
    region: 'central',
    type: 'secondary_hub',
    lat: 31.2089,
    lng: 16.5887,
    warehouseCapacityTons: 1800,
    currentStockTons: 920,
    fuelDepotAvailable: true
  },
  {
    id: 'benghazi',
    name: { en: 'Benghazi Eastern Logistics Hub', ar: 'مركز بنغازي اللوجستي الشرقي' },
    region: 'eastern',
    type: 'primary_hub',
    lat: 32.1167,
    lng: 20.0667,
    warehouseCapacityTons: 4500,
    currentStockTons: 3150,
    fuelDepotAvailable: true
  },
  {
    id: 'derna',
    name: { en: 'Derna Flood Recovery Staging Point', ar: 'نقطة درنة للتعافي وتوزيع الإغاثة' },
    region: 'eastern',
    type: 'distribution_point',
    lat: 32.7670,
    lng: 22.6367,
    warehouseCapacityTons: 1200,
    currentStockTons: 640,
    fuelDepotAvailable: false
  },
  {
    id: 'tobruk',
    name: { en: 'Tobruk Eastern Border Gateway', ar: 'بوابة طبرق والحدود الشرقية' },
    region: 'eastern',
    type: 'border_post',
    lat: 32.0836,
    lng: 23.9764,
    warehouseCapacityTons: 1500,
    currentStockTons: 710,
    fuelDepotAvailable: true
  },
  {
    id: 'sabha',
    name: { en: 'Sabha Southern Regional Base', ar: 'قاعدة سبها الإقليمية الجنوبية' },
    region: 'southern',
    type: 'primary_hub',
    lat: 27.0377,
    lng: 14.4283,
    warehouseCapacityTons: 2500,
    currentStockTons: 1480,
    fuelDepotAvailable: true
  },
  {
    id: 'ubari',
    name: { en: 'Ubari Oasis Distribution Point', ar: 'نقطة توزيع واحة أوباري' },
    region: 'southern',
    type: 'distribution_point',
    lat: 26.5886,
    lng: 12.7789,
    warehouseCapacityTons: 800,
    currentStockTons: 390,
    fuelDepotAvailable: false
  },
  {
    id: 'ghat',
    name: { en: 'Ghat Deep South Border Depot', ar: 'مستودع غات والحدود الجنوبية الغربية' },
    region: 'southern',
    type: 'border_post',
    lat: 24.9633,
    lng: 10.1800,
    warehouseCapacityTons: 600,
    currentStockTons: 280,
    fuelDepotAvailable: false
  },
  {
    id: 'kufra',
    name: { en: 'Al-Kufra South-Eastern Oasis Depot', ar: 'مستودع الكفرة والواحات الجنوبية الشرقية' },
    region: 'southern',
    type: 'border_post',
    lat: 24.1833,
    lng: 23.3000,
    warehouseCapacityTons: 950,
    currentStockTons: 420,
    fuelDepotAvailable: true
  }
];

export const seedCorridors: Corridor[] = [
  // Western Coastal
  {
    id: 'c-trp-msr',
    fromHubId: 'tripoli',
    toHubId: 'misrata',
    distanceKm: 210,
    roadQuality: 'paved',
    threatLevel: 'low',
    baseSpeedKmh: 80,
    checkpointsCount: 3,
    avgCheckpointDelayHrs: 0.3,
    escortRequired: false,
    tollFeeUsd: 40,
    isBlocked: false
  },
  // Central Coastal Link
  {
    id: 'c-msr-srt',
    fromHubId: 'misrata',
    toHubId: 'sirte',
    distanceKm: 240,
    roadQuality: 'paved',
    threatLevel: 'medium',
    baseSpeedKmh: 75,
    checkpointsCount: 4,
    avgCheckpointDelayHrs: 0.5,
    escortRequired: false,
    tollFeeUsd: 60,
    isBlocked: false
  },
  // Eastern Coastal Link
  {
    id: 'c-srt-bng',
    fromHubId: 'sirte',
    toHubId: 'benghazi',
    distanceKm: 560,
    roadQuality: 'paved',
    threatLevel: 'medium',
    baseSpeedKmh: 80,
    checkpointsCount: 6,
    avgCheckpointDelayHrs: 0.8,
    escortRequired: false,
    tollFeeUsd: 110,
    isBlocked: false
  },
  // Eastern Coastal to Derna
  {
    id: 'c-bng-drn',
    fromHubId: 'benghazi',
    toHubId: 'derna',
    distanceKm: 290,
    roadQuality: 'partially_degraded',
    threatLevel: 'low',
    baseSpeedKmh: 65,
    checkpointsCount: 4,
    avgCheckpointDelayHrs: 0.4,
    escortRequired: false,
    tollFeeUsd: 50,
    isBlocked: false
  },
  // Derna to Tobruk
  {
    id: 'c-drn-tbk',
    fromHubId: 'derna',
    toHubId: 'tobruk',
    distanceKm: 175,
    roadQuality: 'paved',
    threatLevel: 'low',
    baseSpeedKmh: 80,
    checkpointsCount: 2,
    avgCheckpointDelayHrs: 0.2,
    escortRequired: false,
    tollFeeUsd: 30,
    isBlocked: false
  },
  // Direct Benghazi to Tobruk
  {
    id: 'c-bng-tbk',
    fromHubId: 'benghazi',
    toHubId: 'tobruk',
    distanceKm: 460,
    roadQuality: 'paved',
    threatLevel: 'low',
    baseSpeedKmh: 85,
    checkpointsCount: 3,
    avgCheckpointDelayHrs: 0.4,
    escortRequired: false,
    tollFeeUsd: 70,
    isBlocked: false
  },
  // Western to Southern Corridor (Tripoli to Sabha)
  {
    id: 'c-trp-sbh',
    fromHubId: 'tripoli',
    toHubId: 'sabha',
    distanceKm: 780,
    roadQuality: 'partially_degraded',
    threatLevel: 'medium',
    baseSpeedKmh: 65,
    checkpointsCount: 7,
    avgCheckpointDelayHrs: 1.0,
    escortRequired: false,
    tollFeeUsd: 140,
    isBlocked: false
  },
  // Misrata to Sabha Inland Cut
  {
    id: 'c-msr-sbh',
    fromHubId: 'misrata',
    toHubId: 'sabha',
    distanceKm: 720,
    roadQuality: 'partially_degraded',
    threatLevel: 'high',
    baseSpeedKmh: 60,
    checkpointsCount: 6,
    avgCheckpointDelayHrs: 1.2,
    escortRequired: true,
    tollFeeUsd: 180,
    isBlocked: false
  },
  // Sirte to Sabha Fezzan Highway
  {
    id: 'c-srt-sbh',
    fromHubId: 'sirte',
    toHubId: 'sabha',
    distanceKm: 610,
    roadQuality: 'desert_track',
    threatLevel: 'high',
    baseSpeedKmh: 55,
    checkpointsCount: 5,
    avgCheckpointDelayHrs: 1.5,
    escortRequired: true,
    tollFeeUsd: 200,
    isBlocked: false
  },
  // Sabha to Ubari
  {
    id: 'c-sbh-ubr',
    fromHubId: 'sabha',
    toHubId: 'ubari',
    distanceKm: 195,
    roadQuality: 'partially_degraded',
    threatLevel: 'medium',
    baseSpeedKmh: 70,
    checkpointsCount: 3,
    avgCheckpointDelayHrs: 0.5,
    escortRequired: false,
    tollFeeUsd: 40,
    isBlocked: false
  },
  // Ubari to Ghat (Deep Southwest Border)
  {
    id: 'c-ubr-ght',
    fromHubId: 'ubari',
    toHubId: 'ghat',
    distanceKm: 360,
    roadQuality: 'desert_track',
    threatLevel: 'critical',
    baseSpeedKmh: 50,
    checkpointsCount: 4,
    avgCheckpointDelayHrs: 1.8,
    escortRequired: true,
    tollFeeUsd: 260,
    isBlocked: false
  },
  // Benghazi to Al-Kufra Desert Corridor
  {
    id: 'c-bng-kfr',
    fromHubId: 'benghazi',
    toHubId: 'kufra',
    distanceKm: 980,
    roadQuality: 'desert_track',
    threatLevel: 'high',
    baseSpeedKmh: 60,
    checkpointsCount: 5,
    avgCheckpointDelayHrs: 1.2,
    escortRequired: true,
    tollFeeUsd: 320,
    isBlocked: false
  },
  // Sabha to Al-Kufra South Trans-Desert
  {
    id: 'c-sbh-kfr',
    fromHubId: 'sabha',
    toHubId: 'kufra',
    distanceKm: 890,
    roadQuality: 'desert_track',
    threatLevel: 'critical',
    baseSpeedKmh: 45,
    checkpointsCount: 4,
    avgCheckpointDelayHrs: 2.0,
    escortRequired: true,
    tollFeeUsd: 380,
    isBlocked: false
  }
];

export const seedVehicles: Vehicle[] = [
  {
    id: 'v-heavy-40t',
    name: { en: '40-Ton Articulated Semi-Trailer', ar: 'شاحنة نقل ثقيل مقطورة (40 طن)' },
    type: 'heavy_40t',
    payloadTons: 40,
    volumeM3: 85,
    fuelConsumptionLitersPer100Km: 38,
    isColdChainEquipped: false,
    dailyRateUsd: 350,
    driverDangerAllowancePerKm: 0.15
  },
  {
    id: 'v-reefer-cold',
    name: { en: '22-Ton Refrigerated Cold-Chain Carrier', ar: 'شاحنة مبردة لحفظ اللقاحات والأدوية (22 طن)' },
    type: 'reefer_coldchain',
    payloadTons: 22,
    volumeM3: 50,
    fuelConsumptionLitersPer100Km: 42,
    isColdChainEquipped: true,
    dailyRateUsd: 520,
    driverDangerAllowancePerKm: 0.22
  },
  {
    id: 'v-medium-10t',
    name: { en: '10-Ton Rigid Flatbed Distribution Truck', ar: 'شاحنة توزيع متوسطة (10 أطنان)' },
    type: 'medium_10t',
    payloadTons: 10,
    volumeM3: 28,
    fuelConsumptionLitersPer100Km: 24,
    isColdChainEquipped: false,
    dailyRateUsd: 190,
    driverDangerAllowancePerKm: 0.10
  },
  {
    id: 'v-unimog-4x4',
    name: { en: '8-Ton All-Terrain 4x4 Off-Road Unimog', ar: 'مركبة إغاثة رباعية الدفع للطرق الوعرة (8 أطنان)' },
    type: 'offroad_unimog',
    payloadTons: 8,
    volumeM3: 20,
    fuelConsumptionLitersPer100Km: 32,
    isColdChainEquipped: false,
    dailyRateUsd: 280,
    driverDangerAllowancePerKm: 0.18
  }
];

export const seedCargoItems: CargoItem[] = [
  {
    id: 'c-vaccines-01',
    name: { en: 'Pediatric Vaccines & Insulin (Cold-Chain 2-8°C)', ar: 'لقاحات أطفال وإنسولين (سلسلة تبريد 2-8 مئوية)' },
    category: 'coldchain_vaccines',
    weightTons: 3.5,
    volumeM3: 8.0,
    priority: 'critical',
    requiresColdChain: true,
    targetTempCelsius: '2°C - 8°C',
    maxExcursionHours: 18,
    selected: true
  },
  {
    id: 'c-trauma-kits',
    name: { en: 'Emergency Surgical & Trauma Medical Kits', ar: 'حقائب جراحية وإسعافات طوارئ للمستشفيات الميدانية' },
    category: 'medical_kits',
    weightTons: 5.2,
    volumeM3: 12.5,
    priority: 'critical',
    requiresColdChain: false,
    selected: true
  },
  {
    id: 'c-rutf-nutrition',
    name: { en: 'Ready-to-Use Therapeutic Food (RUTF Rations)', ar: 'أغذية علاجية جاهزة للأطفال وسوء التغذية' },
    category: 'emergency_food',
    weightTons: 12.0,
    volumeM3: 24.0,
    priority: 'high',
    requiresColdChain: false,
    selected: true
  },
  {
    id: 'c-water-purification',
    name: { en: 'Mobile Water Purification & Chlorination Units', ar: 'وحدات متنقلة لتنقية وتعقيم مياه الشرب' },
    category: 'water_purification',
    weightTons: 4.8,
    volumeM3: 14.0,
    priority: 'high',
    requiresColdChain: false,
    selected: true
  },
  {
    id: 'c-shelter-tents',
    name: { en: 'All-Weather Family Shelter Tents & Tarpaulins', ar: 'خيام إيواء عائلية مقاومة للعوامل الجوية وشوادر' },
    category: 'shelter_tents',
    weightTons: 8.5,
    volumeM3: 32.0,
    priority: 'medium',
    requiresColdChain: false,
    selected: false
  },
  {
    id: 'c-biscuits-heb',
    name: { en: 'High-Energy Fortified Nutrition Biscuits (HEBs)', ar: 'بسكويت عالي الطاقة مدعم بالفيتامينات' },
    category: 'emergency_food',
    weightTons: 10.0,
    volumeM3: 18.0,
    priority: 'medium',
    requiresColdChain: false,
    selected: false
  }
];

export const seedShocks: ShockScenario[] = [
  {
    id: 'baseline',
    name: { en: 'Standard Operational Baseline', ar: 'الوضع التشغيلي الطبيعي (خط الأساس)' },
    description: {
      en: 'All coastal and desert corridors open with standard checkpoint clearances and fuel at $0.65/L.',
      ar: 'كافة الممرات الساحلية والصحراوية سالكة مع إجراءات التفتيش الاعتيادية وسعر ديزل 0.65 دولار/لتر.'
    },
    blockedCorridorIds: [],
    fuelPriceMultiplier: 1.0,
    threatMultiplier: 1.0,
    checkpointDelayMultiplier: 1.0
  },
  {
    id: 'sirte_blockade',
    name: { en: 'Coastal Highway Blockade (Sirte Cut)', ar: 'إغلاق الطريق الساحلي الرئيسي (حصار سرت)' },
    description: {
      en: 'Sirte-Benghazi coastal highway closed due to security cordons, forcing all eastern relief convoys through southern inland desert bypass.',
      ar: 'إغلاق الطريق الساحلي الرابط بين سرت وبنغازي، مما يفرض إعادة توجيه قوافل الإغاثة عبر الممر الصحراوي الجنوبي.'
    },
    blockedCorridorIds: ['c-srt-bng', 'c-msr-srt'],
    fuelPriceMultiplier: 1.25,
    threatMultiplier: 1.4,
    checkpointDelayMultiplier: 1.8
  },
  {
    id: 'fuel_supply_shock',
    name: { en: 'Severe Fuel Shortage & Price Surge (+65%)', ar: 'أزمة وقود خانقة وارتفاع الأسعار (+65%)' },
    description: {
      en: 'National fuel supply bottleneck driving diesel to $1.08/L and doubling checkpoint wait times across all regions.',
      ar: 'اختناق في إمدادات المحروقات يرفع سعر الديزل إلى 1.08 دولار/لتر ويضاعف زمن انتظار الشاحنات عند البوابات.'
    },
    blockedCorridorIds: [],
    fuelPriceMultiplier: 1.65,
    threatMultiplier: 1.1,
    checkpointDelayMultiplier: 2.0
  },
  {
    id: 'southern_escalation',
    name: { en: 'Southern Border Escalation (Fezzan Red Alert)', ar: 'تصعيد أمني حرج في الجنوب (طوارئ فزان)' },
    description: {
      en: 'Threat levels on Sabha-Ubari-Ghat desert corridors spike to Critical. Armed UN/Security escorts mandatory on all supply runs.',
      ar: 'ارتفاع مؤشر الخطر في ممرات سبها-أوباري-غات إلى المستوى الحرج، مع إلزامية الحراسة الأمنية المسلحة لكافة القوافل.'
    },
    blockedCorridorIds: [],
    fuelPriceMultiplier: 1.35,
    threatMultiplier: 2.2,
    checkpointDelayMultiplier: 2.5
  }
];
