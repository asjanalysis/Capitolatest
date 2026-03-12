import { eventDeck } from '../data/events.js';
import { difficultyProfiles } from './state.js';

export function rollEvent(state) {
  const profile = difficultyProfiles[state.difficulty];
  if (Math.random() < profile.treatmentChance) {
    const ev = eventDeck[Math.floor(Math.random() * eventDeck.length)];
    ev.apply(state);
    return `Event: ${ev.text}`;
  }
  return null;
}

export function checkVictoryLoss(state) {
  const controlled = Object.values(state.regions).filter((r)=>r.controlled);
  const reservoirs = controlled.filter((r)=>r.reservoir);

  if (controlled.length >= 12 && state.host.viability > 15) return { done:true, title:'Domination Victory', text:'You achieved body-wide strategic control while preserving host viability long enough for complete takeover.' };
  if (reservoirs.length >= 8) state.victory.chronicCounter += 1;
  else state.victory.chronicCounter = 0;
  if (state.victory.chronicCounter >= 8) return { done:true, title:'Chronic Dominion Victory', text:'Reservoir network is irreversible across organ systems.' };
  if (controlled.length >= 10 && state.resources.stealth >= 2.5 && state.resources.inflammation < 25) return { done:true, title:'Silent Mastery Victory', text:'Stealth persistence succeeded with minimal host crisis.' };

  if (controlled.length === 0) return { done:true, title:'Eradicated', text:'Immune clearance removed all colonies.' };
  if (state.host.viability <= 0) return { done:true, title:'Pyrrhic Collapse', text:'Host died before strategic objectives were secured.' };
  if (state.turn > 120) return { done:true, title:'Containment', text:'Long-term containment blocked full expansion.' };
  return { done:false };
}
