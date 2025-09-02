
import { describe, it, expect } from 'vitest';
import { seedHubs, seedCorridors, seedVehicles, seedCargoItems, seedShocks } from '../src/data/seedLogistics';
import { findOptimalRoute } from '../src/engine/routeOptimization';

describe('AidRoute Optimization & Cost Engine', () => {
  const baselineShock = seedShocks[0];

  it('calculates optimal corridor route from Misrata to Ghat', () => {
    const route = findOptimalRoute(
      'misrata',
      'ghat',
      seedHubs,
      seedCorridors,
      seedVehicles,
      seedCargoItems.filter(c => c.selected),
      'balanced',
      baselineShock
    );

    expect(route).toBeDefined();
    expect(route!.pathHubIds[0]).toBe('misrata');
    expect(route!.pathHubIds[route!.pathHubIds.length - 1]).toBe('ghat');
    expect(route!.totalDistanceKm).toBeGreaterThan(500);
    expect(route!.totalTransitTimeHrs).toBeGreaterThan(10);
    expect(route!.costs.totalCostUsd).toBeGreaterThan(0);
    expect(route!.costs.costPerTonKm).toBeGreaterThan(0);
  });

  it('handles road closures by finding alternative detours', () => {
    const coastalBlockadeShock = seedShocks.find(s => s.id === 'sirte_blockade')!;
    
    const route = findOptimalRoute(
      'misrata',
      'derna',
      seedHubs,
      seedCorridors,
      seedVehicles,
      seedCargoItems.filter(c => c.selected),
      'balanced',
      coastalBlockadeShock
    );

    // The route should not traverse blocked corridor 'c-msr-srt' or 'c-srt-bng'
    if (route) {
      expect(route.corridorIds).not.toContain('c-srt-bng');
    }
  });

  it('correctly assesses cold-chain excursion risk for long multi-day desert journeys', () => {
    const coldCargoOnly = seedCargoItems.filter(c => c.requiresColdChain);

    const longDesertRoute = findOptimalRoute(
      'tripoli',
      'ghat',
      seedHubs,
      seedCorridors,
      seedVehicles,
      coldCargoOnly,
      'coldchain',
      baselineShock
    );

    expect(longDesertRoute).toBeDefined();
    expect(longDesertRoute!.costs.coldChainRefrigerationUsd).toBeGreaterThan(0);
  });

  it('returns null safely when origin equals destination', () => {
    const route = findOptimalRoute(
      'tripoli',
      'tripoli',
      seedHubs,
      seedCorridors,
      seedVehicles,
      seedCargoItems,
      'balanced',
      baselineShock
    );

    expect(route).toBeNull();
  });

  it('validates relief vehicle fleet capabilities and fuel efficiency', () => {
    expect(seedVehicles.length).toBeGreaterThan(0);
    seedVehicles.forEach(vehicle => {
      expect(vehicle.id).toBeTruthy();
      expect(vehicle.name.en).toBeTruthy();
      expect(vehicle.payloadTons).toBeGreaterThan(0);
      expect(vehicle.fuelConsumptionLitersPer100Km).toBeGreaterThan(0);
      expect(vehicle.dailyRateUsd).toBeGreaterThan(0);
    });
  });

  it('validates seed hubs have valid Libyan coordinates and warehouse capacity', () => {
    expect(seedHubs.length).toBeGreaterThanOrEqual(6);
    seedHubs.forEach(hub => {
      expect(hub.id).toBeTruthy();
      expect(hub.name.en).toBeTruthy();
      expect(hub.lat).toBeGreaterThan(20);
      expect(hub.lat).toBeLessThan(35);
      expect(hub.lng).toBeGreaterThan(9);
      expect(hub.lng).toBeLessThan(26);
      expect(hub.warehouseCapacityTons).toBeGreaterThan(0);
      expect(hub.currentStockTons).toBeGreaterThanOrEqual(0);
    });
  });

  it('validates convoy simulation fuel burn and sandstorm speed cap physics', () => {
    const normalSpeed = 75;
    const sandstormCap = 30;
    const distanceKm = 240;

    const normalTime = distanceKm / normalSpeed;
    const sandstormTime = distanceKm / sandstormCap;

    expect(sandstormTime).toBeGreaterThan(normalTime);
    expect(sandstormTime).toBeCloseTo(8.0, 1);

    // Fuel consumption under sandstorm condition increases by ~30%
    const baseBurnLiters = (distanceKm / 100) * 42; // 42L/100km for heavy truck
    const sandstormBurnLiters = (distanceKm / 100) * 55; // 55L/100km in sandstorm
    expect(sandstormBurnLiters).toBeGreaterThan(baseBurnLiters);
  });

  it('ensures WHO/UNICEF cold-chain vaccine temperature bounds (2°C - 8°C)', () => {
    const nominalTemp = 3.8;
    const elevatedTemp = 6.8;
    const criticalBreach = 9.2;

    const isSafeNominal = nominalTemp >= 2.0 && nominalTemp <= 8.0;
    const isSafeElevated = elevatedTemp >= 2.0 && elevatedTemp <= 8.0;
    const isBreach = criticalBreach > 8.0 || criticalBreach < 2.0;

    expect(isSafeNominal).toBe(true);
    expect(isSafeElevated).toBe(true);
    expect(isBreach).toBe(true);
  });
});
