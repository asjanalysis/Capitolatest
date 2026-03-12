import { regions } from '../data/regions.js';
import { difficultyProfiles } from './state.js';

export function runImmunePhase(state) {
  const profile = difficultyProfiles[state.difficulty];
  const controlled = Object.entries(state.regions).filter(([,v])=>v.controlled);
  const pressureScale = profile.immuneSpeed + state.modifiers.immuneSpeed + state.host.adaptivePressure * 0.03;
  let totalCleared = 0;

  controlled.forEach(([id, slot]) => {
    const r = regions.find((x)=>x.id===id);
    const localPressure = (r.env.immune * 2 + state.resources.immuneAttention * 0.15 + slot.visibility) * pressureScale;
    let clearance = Math.max(0, Math.floor(localPressure - state.resources.stealth * 0.5 - (slot.reservoir ? 1 : 0)));
    clearance += state.modifiers.globalClearance;
    if (r.type.includes('respiratory')) clearance += state.modifiers.respiratoryClearance;
    if (state.flags.treatment && slot.biomass > 5) clearance += 2;
    slot.biomass = Math.max(0, slot.biomass - clearance);
    totalCleared += clearance;
    slot.visibility = Math.max(0, slot.visibility - 0.05);
    if (slot.biomass === 0) {
      slot.controlled = false;
      slot.reservoir = false;
    }
  });

  state.host.adaptivePressure = Math.min(12, state.host.adaptivePressure + 0.3 + totalCleared * 0.01);
  state.resources.inflammation = Math.min(100, state.resources.inflammation + totalCleared * 0.08 + state.resources.damage * 0.2);
  state.resources.immuneAttention = Math.min(20, state.resources.immuneAttention + controlled.length * 0.06);
  state.flags.treatment = false;
  state.modifiers = { globalClearance:0, respiratoryClearance:0, giColonize:0, surfaceAccess:0, immuneSpeed:0 };

  return `Immune response cleared ${totalCleared.toFixed(0)} biomass.`;
}
