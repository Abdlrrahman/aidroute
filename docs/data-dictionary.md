# Logistics Data Dictionary

| Field | Type | Description |
| :--- | :--- | :--- |
| `fromHubId`, `toHubId` | `string` | Connecting hub identifiers |
| `distanceKm` | `number` | Road segment distance in kilometers |
| `roadQuality` | `enum` | `paved`, `partially_degraded`, or `desert_track` |
| `threatLevel` | `enum` | Security tier: `low`, `medium`, `high`, `critical` |
| `checkpointsCount` | `number` | Number of military / police control checkpoints |
| `avgCheckpointDelayHrs`| `number` | Average convoy clearance latency per gate |
| `escortRequired` | `boolean` | Mandatory armed security convoy escort |
| `tollFeeUsd` | `number` | Administrative gate and transit toll fees |
