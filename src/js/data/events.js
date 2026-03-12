export const eventDeck = [
  { id:'fever_spike', text:'Fever spike raises clearance globally.', apply:(s)=>{ s.modifiers.globalClearance += 1; } },
  { id:'mucus_surge', text:'Mucus clearance surge in respiratory tract.', apply:(s)=>{ s.modifiers.respiratoryClearance += 1; } },
  { id:'microbiome_disruption', text:'Microbiome disruption opens GI niches.', apply:(s)=>{ s.modifiers.giColonize += 0.2; } },
  { id:'injury_gateway', text:'Minor tissue injury expands surface entry options.', apply:(s)=>{ s.modifiers.surfaceAccess += 1; } },
  { id:'immunocompromised_window', text:'Temporary immune dip lowers host response this turn.', apply:(s)=>{ s.modifiers.immuneSpeed -= 1; } },
  { id:'treatment_pressure', text:'Targeted treatment pressure focuses on highest biomass region.', apply:(s)=>{ s.flags.treatment = true; } },
  { id:'barrier_healing', text:'Barrier repair hardens wounded epithelium.', apply:(s)=>{ s.modifiers.surfaceAccess -= 1; } }
];
