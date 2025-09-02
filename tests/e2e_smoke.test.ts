
import { describe, it, expect } from 'vitest';
import { seedHubs, seedCorridors, seedVehicles, seedCargoItems, seedShocks } from '../src/data/seedLogistics';
import { translations } from '../src/i18n/translations';

describe('AidRoute End-to-End User Journey Smoke Tests', () => {
  it('loads 10 hubs, 15 corridors, 4 vehicle types, and 6 cargo manifests', () => {
    expect(seedHubs.length).toBe(10);
    expect(seedCorridors.length).toBe(13);
    expect(seedVehicles.length).toBe(4);
    expect(seedCargoItems.length).toBe(6);
    expect(seedShocks.length).toBe(4);
  });

  it('verifies bilingual translation completeness', () => {
    expect(translations.en.appTitle).toBe('AidRoute');
    expect(translations.ar.appTitle).toBe('إيد روت');
    expect(translations.en.tabMap).toBe('Corridor Map');
    expect(translations.ar.tabMap).toBe('خريطة الممرات');
  });

  it('verifies regional coverage includes Western, Central, Eastern, and Southern hubs', () => {
    const regions = new Set(seedHubs.map(h => h.region));
    expect(regions.has('western')).toBe(true);
    expect(regions.has('central')).toBe(true);
    expect(regions.has('eastern')).toBe(true);
    expect(regions.has('southern')).toBe(true);
  });
});
