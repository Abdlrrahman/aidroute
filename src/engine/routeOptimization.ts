
import type {
  Hub,
  Corridor,
  Vehicle,
  CargoItem,
  OptimizationGoal,
  CalculatedRoute,
  RouteCostBreakdown,
  ShockScenario
} from '../types/logistics';

interface GraphEdge {
  corridor: Corridor;
  targetHubId: string;
}

export function buildAdjacencyList(hubs: Hub[], corridors: Corridor[]): Map<string, GraphEdge[]> {
  const adj = new Map<string, GraphEdge[]>();
  for (const h of hubs) {
    adj.set(h.id, []);
  }

  for (const c of corridors) {
    if (c.isBlocked) continue;

    // Undirected corridors
    const listA = adj.get(c.fromHubId);
    if (listA) listA.push({ corridor: c, targetHubId: c.toHubId });

    const listB = adj.get(c.toHubId);
    if (listB) listB.push({ corridor: c, targetHubId: c.fromHubId });
  }

  return adj;
}

export function calculateEdgeWeight(
  corridor: Corridor,
  goal: OptimizationGoal,
  shock: ShockScenario,
  requiresColdChain: boolean
): number {
  const threatMultiplier = shock.threatMultiplier;
  const threatScore = corridor.threatLevel === 'critical' ? 4.0 :
    corridor.threatLevel === 'high' ? 2.5 :
    corridor.threatLevel === 'medium' ? 1.5 : 1.0;

  const effectiveThreat = threatScore * threatMultiplier;

  const roadSpeedFactor = corridor.roadQuality === 'paved' ? 1.0 :
    corridor.roadQuality === 'partially_degraded' ? 0.8 : 0.6;

  const transitTimeHrs = (corridor.distanceKm / (corridor.baseSpeedKmh * roadSpeedFactor)) +
    (corridor.checkpointsCount * corridor.avgCheckpointDelayHrs * shock.checkpointDelayMultiplier);

  const baseFuelCost = (corridor.distanceKm * 0.35) * (0.65 * shock.fuelPriceMultiplier);
  const escortCost = corridor.escortRequired ? corridor.distanceKm * 1.5 : 0;
  const totalEdgeCost = baseFuelCost + escortCost + corridor.tollFeeUsd;

  switch (goal) {
    case 'fastest':
      return transitTimeHrs * 10 + corridor.distanceKm * 0.1 + effectiveThreat * 2;
    case 'safest':
      return effectiveThreat * 50 + transitTimeHrs * 5 + corridor.distanceKm * 0.5;
    case 'cheapest':
      return totalEdgeCost + corridor.distanceKm * 0.2 + transitTimeHrs * 2;
    case 'coldchain':
      return transitTimeHrs * 20 + (requiresColdChain && transitTimeHrs > 10 ? 500 : 0) + effectiveThreat * 10;
    case 'balanced':
    default:
      return corridor.distanceKm * 0.5 + transitTimeHrs * 8 + effectiveThreat * 15 + totalEdgeCost * 0.1;
  }
}

export function findOptimalRoute(
  originId: string,
  destinationId: string,
  hubs: Hub[],
  corridors: Corridor[],
  vehicles: Vehicle[],
  selectedCargo: CargoItem[],
  goal: OptimizationGoal,
  shock: ShockScenario
): CalculatedRoute | null {
  if (originId === destinationId) return null;

  const requiresColdChain = selectedCargo.some(c => c.requiresColdChain);
  const totalCargoWeight = selectedCargo.reduce((sum, c) => sum + c.weightTons, 0);

  // Apply shock modifications to corridors
  const activeCorridors = corridors.map(c => ({
    ...c,
    isBlocked: c.isBlocked || shock.blockedCorridorIds.includes(c.id)
  }));

  const adj = buildAdjacencyList(hubs, activeCorridors);

  // Dijkstra shortest path
  const distances = new Map<string, number>();
  const previous = new Map<string, { hubId: string; corridor: Corridor }>();
  const unvisited = new Set<string>();

  for (const h of hubs) {
    distances.set(h.id, Infinity);
    unvisited.add(h.id);
  }

  distances.set(originId, 0);

  while (unvisited.size > 0) {
    // Pick unvisited node with smallest distance
    let currentId: string | null = null;
    let minD = Infinity;

    for (const id of unvisited) {
      const d = distances.get(id)!;
      if (d < minD) {
        minD = d;
        currentId = id;
      }
    }

    if (!currentId || minD === Infinity) break;
    if (currentId === destinationId) break;

    unvisited.delete(currentId);

    const edges = adj.get(currentId) || [];
    for (const edge of edges) {
      if (!unvisited.has(edge.targetHubId)) continue;

      const weight = calculateEdgeWeight(edge.corridor, goal, shock, requiresColdChain);
      const alt = distances.get(currentId)! + weight;

      if (alt < distances.get(edge.targetHubId)!) {
        distances.set(edge.targetHubId, alt);
        previous.set(edge.targetHubId, { hubId: currentId, corridor: edge.corridor });
      }
    }
  }

  // Backtrack path
  if (!previous.has(destinationId)) return null;

  const pathHubIds: string[] = [destinationId];
  const corridorIds: string[] = [];
  const traversedCorridors: Corridor[] = [];

  let curr = destinationId;
  while (curr !== originId) {
    const prev = previous.get(curr);
    if (!prev) break;
    pathHubIds.unshift(prev.hubId);
    corridorIds.unshift(prev.corridor.id);
    traversedCorridors.unshift(prev.corridor);
    curr = prev.hubId;
  }

  // Calculate Aggregates
  let totalDistanceKm = 0;
  let totalTransitTimeHrs = 0;
  let totalCheckpoints = 0;
  let totalTolls = 0;
  let escortDistanceKm = 0;
  let threatSum = 0;

  for (const c of traversedCorridors) {
    totalDistanceKm += c.distanceKm;

    const roadSpeedFactor = c.roadQuality === 'paved' ? 1.0 :
      c.roadQuality === 'partially_degraded' ? 0.8 : 0.6;

    const segmentTime = (c.distanceKm / (c.baseSpeedKmh * roadSpeedFactor)) +
      (c.checkpointsCount * c.avgCheckpointDelayHrs * shock.checkpointDelayMultiplier);

    totalTransitTimeHrs += segmentTime;
    totalCheckpoints += c.checkpointsCount;
    totalTolls += c.tollFeeUsd;

    if (c.escortRequired || (shock.threatMultiplier > 1.5 && (c.threatLevel === 'high' || c.threatLevel === 'critical'))) {
      escortDistanceKm += c.distanceKm;
    }

    const tVal = c.threatLevel === 'critical' ? 90 :
      c.threatLevel === 'high' ? 65 :
      c.threatLevel === 'medium' ? 35 : 15;
    threatSum += tVal * (c.distanceKm / Math.max(1, totalDistanceKm));
  }

  // Format Time & Fuel
  totalTransitTimeHrs = Number(totalTransitTimeHrs.toFixed(1));
  const overallThreatScore = Math.min(100, Math.round(threatSum * shock.threatMultiplier));

  // Determine Fleet Allocation
  const primaryVehicle = requiresColdChain
    ? vehicles.find(v => v.type === 'reefer_coldchain') || vehicles[0]
    : totalCargoWeight > 20
    ? vehicles.find(v => v.type === 'heavy_40t') || vehicles[0]
    : vehicles.find(v => v.type === 'medium_10t') || vehicles[0];

  const vehiclesNeeded = Math.max(1, Math.ceil(totalCargoWeight / Math.max(1, primaryVehicle.payloadTons)));
  const totalFuelLiters = Math.round((totalDistanceKm * primaryVehicle.fuelConsumptionLitersPer100Km / 100) * vehiclesNeeded);

  // Financial Cost Model
  const dieselPricePerLiter = 0.65 * shock.fuelPriceMultiplier;
  const fuelCostUsd = Math.round(totalFuelLiters * dieselPricePerLiter);
  const driverRiskAllowanceUsd = Math.round(totalDistanceKm * primaryVehicle.driverDangerAllowancePerKm * vehiclesNeeded * (overallThreatScore / 40));
  const securityEscortUsd = Math.round(escortDistanceKm * 1.65);
  const tollsAndClearanceUsd = Math.round(totalTolls * vehiclesNeeded);
  const coldChainRefrigerationUsd = requiresColdChain ? Math.round(totalTransitTimeHrs * 22 * vehiclesNeeded) : 0;
  const missionDays = Math.max(1, Math.ceil(totalTransitTimeHrs / 10)); // 10 driving hours/day
  const vehicleFleetRentalUsd = primaryVehicle.dailyRateUsd * missionDays * vehiclesNeeded;

  const totalCostUsd = fuelCostUsd + driverRiskAllowanceUsd + securityEscortUsd + tollsAndClearanceUsd + coldChainRefrigerationUsd + vehicleFleetRentalUsd;
  const tonKm = Math.max(1, totalCargoWeight * totalDistanceKm);
  const costPerTonKm = Number((totalCostUsd / tonKm).toFixed(3));

  // Cold Chain Risk Analysis
  let coldChainRisk: 'safe' | 'warning' | 'critical_excursion' = 'safe';
  if (requiresColdChain) {
    if (totalTransitTimeHrs > 24) {
      coldChainRisk = 'critical_excursion';
    } else if (totalTransitTimeHrs > 14) {
      coldChainRisk = 'warning';
    }
  }

  // Explanation Text
  const originHub = hubs.find(h => h.id === originId);
  const destHub = hubs.find(h => h.id === destinationId);

  const explanation = {
    en: 'Route selected via ' + pathHubIds.length + ' hubs (' + totalDistanceKm + ' km, ~' + totalTransitTimeHrs + 'h). ' +
      (goal === 'safest' ? 'Prioritized low-threat corridors to minimize convoy security risk. ' : '') +
      (goal === 'cheapest' ? 'Optimized to minimize fuel burn and toll fees. ' : '') +
      (requiresColdChain ? 'Cold-chain active with ' + primaryVehicle.name.en + ' deployed.' : 'Standard dry cargo dispatch with ' + vehiclesNeeded + ' unit(s).'),
    ar: 'تم اختيار المسار عبر ' + pathHubIds.length + ' مراكز (' + totalDistanceKm + ' كم، حوالي ' + totalTransitTimeHrs + ' ساعة). ' +
      (goal === 'safest' ? 'تم تفضيل الممرات الأقل خطورة لتقليل المخاطر الأمنية على القافلة. ' : '') +
      (goal === 'cheapest' ? 'تم تحسين المسار لتقليل استهلاك الوقود ورسوم العبور. ' : '') +
      (requiresColdChain ? 'تم تفعيل سلسلة التبريد بواسطة ' + primaryVehicle.name.ar + '.' : 'شحن بضائع اعتيادي بعدد ' + vehiclesNeeded + ' مركبة.')
  };

  const costs: RouteCostBreakdown = {
    fuelCostUsd,
    driverRiskAllowanceUsd,
    securityEscortUsd,
    tollsAndClearanceUsd,
    coldChainRefrigerationUsd,
    vehicleFleetRentalUsd,
    totalCostUsd,
    costPerTonKm
  };

  return {
    pathHubIds,
    totalDistanceKm,
    totalTransitTimeHrs,
    totalFuelLiters,
    overallThreatScore,
    coldChainRisk,
    costs,
    checkpointsPassed: totalCheckpoints,
    explanation,
    corridorIds
  };
}
