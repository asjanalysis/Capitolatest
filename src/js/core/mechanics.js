import { regions } from '../data/regions.js';
import { researchNodes } from '../data/research.js';
import { difficultyProfiles } from './state.js';

export const regionById = Object.fromEntries(regions.map((r)=>[r.id,r]));

function hasRoute(state, region) {
  return region.routes.some((route)=> state.faction.spreadRoutes.includes(route) || state.unlockedResearch.includes('bloodstream_survival') && route==='blood' || state.unlockedResearch.includes('neural_tropism') && route==='neural');
}

function colonizeScore(state, region) {
  const res = state.resources;
  const env = region.env;
  let score = 0.45 + res.access*0.05 + res.stealth*0.04 - env.barrier*0.25 - env.immune*0.22;
  if (region.type === 'gi') score -= Math.max(0, (4 - env.pH)) * 0.07;
  if (state.unlockedResearch.includes('acid_tolerance') && region.id === 'stomach') score += 0.3;
  if (state.unlockedResearch.includes('mucus_resistance')) score += env.mucus * 0.12;
  if (state.modifiers.giColonize && region.type === 'gi') score += state.modifiers.giColonize;
  if (region.requires && !region.requires.every((req)=>state.unlockedResearch.includes(req))) score -= 0.6;
  if (!hasRoute(state, region)) score -= 0.4;
  return Math.max(0.05, Math.min(0.95, score));
}

export function spreadToRegion(state, targetId) {
  const target = regionById[targetId];
  const selected = regionById[state.selectedRegion];
  if (!selected.neighbors.includes(targetId)) return { ok:false, message:'No anatomical link.' };
  if (state.resources.replication < 1) return { ok:false, message:'Insufficient replication capacity.' };

  const chance = colonizeScore(state, target);
  state.resources.replication -= 1;

  if (Math.random() < chance) {
    state.regions[targetId].controlled = true;
    state.regions[targetId].biomass += 2;
    state.regions[targetId].visibility += 0.25;
    state.resources.biomass += 2;
    state.host.symptomBurden += target.symptom * 0.2;
    return { ok:true, message:`Colonized ${target.name} (${Math.round(chance*100)}%).` };
  }
  state.regions[targetId].visibility += 0.1;
  return { ok:false, message:`Spread failed in ${target.name} (${Math.round(chance*100)}%).` };
}

export function fortifyRegion(state, id) {
  const slot = state.regions[id];
  if (!slot.controlled || state.resources.biomass < 2) return false;
  slot.reservoir = true;
  slot.biomass += 1;
  state.resources.biomass -= 2;
  state.resources.reservoirStability += 1;
  return true;
}

export function buyResearch(state, id) {
  const node = researchNodes.find((n)=>n.id===id);
  if (!node || state.unlockedResearch.includes(id)) return { ok:false, msg:'Unavailable.' };
  if (!node.prereq.every((p)=>state.unlockedResearch.includes(p))) return { ok:false, msg:'Missing prerequisite.' };
  if (state.resources.diversity < node.cost) return { ok:false, msg:'Need more genetic diversity.' };
  state.resources.diversity -= node.cost;
  state.unlockedResearch.push(id);
  if (node.apply.stealth) state.resources.stealth += node.apply.stealth;
  if (node.apply.replication) state.resources.replication += node.apply.replication;
  if (node.apply.damage) state.resources.damage += node.apply.damage;
  if (node.apply.attention) state.resources.immuneAttention += node.apply.attention;
  return { ok:true, msg:`Adaptation unlocked: ${node.name}` };
}

export function applyEndTurnEconomy(state) {
  const profile = difficultyProfiles[state.difficulty];
  const controlledRegions = Object.entries(state.regions).filter(([,r])=>r.controlled);
  let bioGain = 0;
  let divGain = 0;
  let symptom = 0;

  controlledRegions.forEach(([id, slot]) => {
    const reg = regionById[id];
    bioGain += reg.yields.biomass + (slot.reservoir ? 1 : 0);
    divGain += reg.yields.diversity;
    symptom += reg.symptom * 0.15 + slot.biomass * 0.03;
    slot.biomass += 1;
    slot.visibility += 0.08;
  });

  state.resources.biomass += bioGain;
  state.resources.diversity += divGain;
  state.resources.replication = Math.max(1, Math.floor(state.faction.starterTraits.replication + controlledRegions.length / 3));
  state.host.symptomBurden = Math.min(100, state.host.symptomBurden + symptom * 0.2);
  const viabilityDrop = (state.host.symptomBurden * 0.08 + state.resources.inflammation * 0.05) / profile.resilience;
  state.host.viability = Math.max(0, state.host.viability - viabilityDrop);
}
