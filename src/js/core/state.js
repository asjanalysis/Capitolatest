import { factions } from '../data/factions.js';
import { regions } from '../data/regions.js';

export const difficultyProfiles = {
  standard:{immuneSpeed:1,treatmentChance:0.15,resilience:1},
  harsh:{immuneSpeed:1.3,treatmentChance:0.22,resilience:0.9},
  lenient:{immuneSpeed:0.8,treatmentChance:0.1,resilience:1.1}
};

export function createInitialState(factionId, difficulty='standard') {
  const faction = factions.find((f) => f.id === factionId);
  const startId = faction.preferredTissues[0];
  const regState = Object.fromEntries(regions.map((r) => [r.id, { controlled:false, biomass:0, reservoir:false, visibility:0 }]));
  regState[startId] = { controlled:true, biomass:4, reservoir:true, visibility:0.5 };

  return {
    version:1,
    turn:1,
    difficulty,
    faction,
    selectedRegion:startId,
    regions:regState,
    resources:{ biomass:10, replication:faction.starterTraits.replication, diversity:faction.starterTraits.diversity, stealth:faction.starterTraits.stealth, access:faction.starterTraits.access, damage:faction.starterTraits.damage, inflammation:5, immuneAttention:4, reservoirStability:3 },
    host:{ viability:100, symptomBurden:3, adaptivePressure:0, innatePressure:4 },
    unlockedResearch:[],
    logs:['Infection initialized.'],
    modifiers:{ globalClearance:0, respiratoryClearance:0, giColonize:0, surfaceAccess:0, immuneSpeed:0 },
    flags:{ treatment:false },
    victory:{ chronicCounter:0 }
  };
}
