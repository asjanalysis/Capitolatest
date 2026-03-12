export const factions = [
  {
    id:'extracellular_bacterium',
    name:'Pyocline Legion',
    inspiration:'Extracellular pyogenic bacteria archetype',
    strengths:['Rapid biomass growth','Strong biofilm persistence'],
    weaknesses:['High immune visibility','Limited neural access'],
    preferredTissues:['skin_wound','mouth','pharynx'],
    spreadRoutes:['surface','mucosal','blood'],
    persistence:'Biofilm-supported colony strongholds',
    immuneProfile:'Triggers strong innate inflammation',
    starterTraits:{replication:3,stealth:1,access:2,damage:2,diversity:2},
    uniqueTech:['biofilm_matrix','toxin_pulse'],
    winStyle:'Chronic Dominion via entrenched reservoirs'
  },
  {
    id:'intracellular_bacterium',name:'Endocyte Syndicate',inspiration:'Intracellular bacterial pathogens',
    strengths:['Immune evasion in host cells','Long persistence'],weaknesses:['Slow expansion','Low burst spread'],
    preferredTissues:['alveoli','lymph','bone_marrow'],spreadRoutes:['mucosal','lymph','blood'],
    persistence:'Cell-associated latent pockets',immuneProfile:'Delays adaptive detection',
    starterTraits:{replication:2,stealth:3,access:2,damage:1,diversity:2},uniqueTech:['intracellular_shelter','granuloma_niche'],winStyle:'Silent Mastery'
  },
  {
    id:'enveloped_rna_virus',name:'Vireon Drift',inspiration:'Enveloped RNA respiratory/systemic viruses',
    strengths:['Fast spread','High adaptation tempo'],weaknesses:['Fragile outside supportive tissues','Poor long-term stability'],
    preferredTissues:['nasal','pharynx','bronchi'],spreadRoutes:['mucosal','blood'],persistence:'Short-lived waves with antigenic drift',
    immuneProfile:'Early innate alarms; adaptive pressure rises quickly',starterTraits:{replication:3,stealth:2,access:2,damage:2,diversity:3},
    uniqueTech:['antigenic_drift','syncytial_spread'],winStyle:'Hyperacute Overrun'
  },
  {
    id:'non_enveloped_virus',name:'Capsid Accord',inspiration:'Non-enveloped enteric/stable viruses',
    strengths:['Environmental robustness','Strong GI resilience'],weaknesses:['Lower entry flexibility','Moderate symptom burst'],
    preferredTissues:['mouth','stomach','small_intestine'],spreadRoutes:['mucosal','blood'],persistence:'Durable capsid reservoirs',immuneProfile:'Steady adaptive targeting',
    starterTraits:{replication:2,stealth:2,access:2,damage:2,diversity:2},uniqueTech:['capsid_hardening','acid_tolerance'],winStyle:'Distributed persistent control'
  },
  {
    id:'fungal_pathogen',name:'Mycelis Court',inspiration:'Opportunistic fungal pathogens',
    strengths:['Exceptional persistence','Stress tolerance'],weaknesses:['Slow dissemination','High nutrient dependence'],
    preferredTissues:['skin_wound','deep_tissue','gu_tract'],spreadRoutes:['surface','blood'],persistence:'Spore and hyphal sanctuary network',immuneProfile:'Moderate detection, difficult clearance once established',
    starterTraits:{replication:1,stealth:2,access:1,damage:1,diversity:3},uniqueTech:['spore_reservoir','hyphal_invasion'],winStyle:'Late-game fortress expansion'
  },
  {
    id:'protozoan_parasite',name:'Troph Cascade',inspiration:'Protozoan/eukaryotic tissue-stage parasites',
    strengths:['Stage-shift flexibility','Strong bloodstream mobility'],weaknesses:['Complex setup','High adaptation cost'],
    preferredTissues:['bloodstream','liver','deep_tissue'],spreadRoutes:['blood','lymph'],persistence:'Multi-stage tissue residency',immuneProfile:'Cyclic visibility and concealment',
    starterTraits:{replication:2,stealth:2,access:3,damage:2,diversity:2},uniqueTech:['stage_shift','immune_decoy_cast'],winStyle:'Networked multi-organ dominance'
  }
];
