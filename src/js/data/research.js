export const researchNodes = [
  { id:'mucus_resistance', name:'Mucus Resistance', category:'Barrier Survival', cost:3, effects:{colonize:0.12}, tradeoff:'Slightly lower stealth (-0.1 stealth)', apply:{stealth:-0.1}, prereq:[] },
  { id:'acid_tolerance', name:'Acid Tolerance', category:'Environmental Tolerance', cost:4, effects:{stomach:0.25}, tradeoff:'Replication cost (+1 upkeep)', apply:{upkeep:1}, prereq:[] },
  { id:'oxidative_stress_tolerance', name:'Oxidative Stress Tolerance', category:'Immune Evasion', cost:4, effects:{immuneResist:0.15}, tradeoff:'Reduced burst growth (-0.1 replication)', apply:{replication:-0.1}, prereq:[] },
  { id:'bloodstream_survival', name:'Bloodstream Survival', category:'Dissemination Routes', cost:5, effects:{route:'blood',colonize:0.15}, tradeoff:'Higher immune attention gain', apply:{attention:1}, prereq:['oxidative_stress_tolerance'] },
  { id:'biofilm_matrix', name:'Biofilm Matrix', category:'Persistence & Reservoirs', cost:5, effects:{clearanceResist:0.2}, tradeoff:'Spread speed reduced', apply:{replication:-0.15}, prereq:['mucus_resistance'] },
  { id:'intracellular_shelter', name:'Intracellular Shelter', category:'Immune Evasion', cost:6, effects:{stealth:0.25}, tradeoff:'Damage output reduced', apply:{damage:-0.2}, prereq:['oxidative_stress_tolerance'] },
  { id:'antigenic_drift', name:'Antigenic Drift', category:'Immune Evasion', cost:5, effects:{adaptation:1}, tradeoff:'Instability increases mutation upkeep', apply:{upkeep:1}, prereq:['mucus_resistance'] },
  { id:'neural_tropism', name:'Neural Tropism Shift', category:'Tissue Entry & Adhesion', cost:6, effects:{unlock:'neural'}, tradeoff:'Narrower GI efficiency', apply:{giPenalty:0.15}, prereq:['bloodstream_survival'] },
  { id:'dormancy_program', name:'Dormancy Program', category:'Persistence & Reservoirs', cost:6, effects:{sanctuary:0.25}, tradeoff:'Active spread reduced during dormancy turns', apply:{replication:-0.1}, prereq:['intracellular_shelter'] },
  { id:'hypervirulence', name:'Hypervirulence Cascade', category:'Cytopathic Effects', cost:5, effects:{damage:0.35,spreadOnSymptom:1}, tradeoff:'Immune attention spikes', apply:{stealth:-0.25,attention:2}, prereq:['bloodstream_survival'] }
];
