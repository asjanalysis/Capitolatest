import { regions } from '../data/regions.js';
import { researchNodes } from '../data/research.js';

function drawConnections(ctx) {
  ctx.strokeStyle = '#2f4356';
  ctx.lineWidth = 2;
  regions.forEach((region) => {
    region.neighbors.forEach((n) => {
      const target = regions.find((r)=>r.id===n);
      if (target && region.id < target.id) {
        ctx.beginPath();
        ctx.moveTo(region.x, region.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });
  });
}

export function renderMap(state, canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0b1118';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  drawConnections(ctx);

  regions.forEach((r)=> {
    const rs = state.regions[r.id];
    const selected = state.selectedRegion === r.id;
    ctx.fillStyle = rs.controlled ? '#cf3f52' : '#4f6a83';
    ctx.strokeStyle = selected ? '#f0b541' : '#152331';
    ctx.lineWidth = selected ? 3 : 2;
    ctx.beginPath();
    ctx.rect(r.x-16,r.y-10,32,20);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#eaf2ff';
    ctx.font = '9px Courier New';
    ctx.fillText(r.name.slice(0, 11), r.x-20, r.y-14);
    if (rs.reservoir) {
      ctx.fillStyle = '#72d486';
      ctx.fillRect(r.x+12, r.y-8, 4, 4);
    }
  });
}

export function renderPanels(state) {
  const controlledCount = Object.values(state.regions).filter((r)=>r.controlled).length;

  document.getElementById('host-status-panel').innerHTML = `
    <h3>Host Status</h3>
    <div class="metric-grid">
      <div class="metric">Turn: ${state.turn}</div>
      <div class="metric">Viability: ${state.host.viability.toFixed(1)}</div>
      <div class="metric">Symptoms: ${state.host.symptomBurden.toFixed(1)}</div>
      <div class="metric">Adaptive Pressure: ${state.host.adaptivePressure.toFixed(1)}</div>
    </div>`;

  document.getElementById('pathogen-panel').innerHTML = `
    <h3>${state.faction.name}</h3>
    <p>${state.faction.inspiration}</p>
    <div class="metric-grid">
      <div class="metric">Biomass: ${state.resources.biomass.toFixed(0)}</div>
      <div class="metric">Replication: ${state.resources.replication.toFixed(1)}</div>
      <div class="metric">Diversity: ${state.resources.diversity.toFixed(0)}</div>
      <div class="metric">Stealth: ${state.resources.stealth.toFixed(1)}</div>
      <div class="metric">Damage: ${state.resources.damage.toFixed(1)}</div>
      <div class="metric">Controlled Regions: ${controlledCount}</div>
    </div>`;

  const current = regions.find((r)=>r.id===state.selectedRegion);
  const rs = state.regions[state.selectedRegion];
  document.getElementById('region-panel').innerHTML = `
    <h3>Region: ${current.name}</h3>
    <p>Type: ${current.type} | Routes: ${current.routes.join(', ')}</p>
    <p>Immune ${current.env.immune}, Barrier ${current.env.barrier}, pH ${current.env.pH}</p>
    <div class="metric-grid">
      <div class="metric">Controlled: ${rs.controlled ? 'Yes' : 'No'}</div>
      <div class="metric">Biomass: ${rs.biomass.toFixed(0)}</div>
      <div class="metric">Reservoir: ${rs.reservoir ? 'Yes' : 'No'}</div>
      <div class="metric">Clearance Rate: ${current.clearance}</div>
    </div>`;

  const actions = current.neighbors.map((id)=>`<button data-target="${id}">Spread to ${regions.find((r)=>r.id===id).name}</button>`).join('');
  document.getElementById('actions-panel').innerHTML = `
    <h3>Actions</h3>
    <div class="actions">${actions}<button id="btn-fortify">Create Reservoir</button></div>`;

  const rList = researchNodes.map((node)=> {
    const unlocked = state.unlockedResearch.includes(node.id);
    const canBuy = node.prereq.every((p)=>state.unlockedResearch.includes(p));
    return `<div class="research-item ${unlocked?'unlocked':''}">
      <strong>${node.name}</strong> <em>${node.category}</em><br />
      Cost ${node.cost} diversity. Tradeoff: ${node.tradeoff}<br />
      ${unlocked ? 'Unlocked' : `<button data-research="${node.id}" ${canBuy?'':'disabled'}>Adapt</button>`}
    </div>`;
  }).join('');
  document.getElementById('research-list').innerHTML = rList;

  document.getElementById('log-feed').innerHTML = state.logs.slice(-18).map((line)=>`<div class="log-entry">${line}</div>`).join('');
}
