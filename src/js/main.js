import { factions } from './data/factions.js';
import { codexEntries } from './data/codex.js';
import { regions } from './data/regions.js';
import { createInitialState } from './core/state.js';
import { spreadToRegion, buyResearch, fortifyRegion, applyEndTurnEconomy } from './core/mechanics.js';
import { runImmunePhase } from './core/immune.js';
import { rollEvent, checkVictoryLoss } from './core/events.js';
import { renderMap, renderPanels } from './ui/render.js';

let state = null;
const canvas = document.getElementById('map-canvas');

function log(msg) { state.logs.push(`[T${state.turn}] ${msg}`); }

function setupFactionMenu() {
  const wrap = document.getElementById('faction-options');
  let selected = null;
  wrap.innerHTML = factions.map((f)=>`<div class="faction-card" data-faction="${f.id}">
      <strong>${f.name}</strong><br/><small>${f.inspiration}</small>
      <ul><li>Strength: ${f.strengths[0]}</li><li>Weakness: ${f.weaknesses[0]}</li><li>Win: ${f.winStyle}</li></ul>
    </div>`).join('');

  wrap.querySelectorAll('.faction-card').forEach((card)=>{
    card.addEventListener('click', ()=>{
      selected = card.dataset.faction;
      wrap.querySelectorAll('.faction-card').forEach((c)=>c.classList.remove('selected'));
      card.classList.add('selected');
      document.getElementById('btn-start-game').disabled = false;
    });
  });

  document.getElementById('btn-start-game').onclick = () => {
    const diff = document.getElementById('difficulty-select').value;
    state = createInitialState(selected, diff);
    document.getElementById('menu-modal').classList.remove('open');
    initCodex();
    renderAll();
  };
}

function initCodex() {
  const select = document.getElementById('codex-topic');
  const regionTopics = regions.map((r)=>({ key:`region_${r.id}`, title:r.name, body:`${r.name}: ${r.type} tissue. Immune ${r.env.immune}, barrier ${r.env.barrier}, pH ${r.env.pH}.` }));
  const factionTopics = factions.map((f)=>({ key:`faction_${f.id}`, title:f.name, body:`${f.inspiration}. Spread: ${f.spreadRoutes.join(', ')}. Persistence: ${f.persistence}.` }));
  const entries = [
    ...Object.entries(codexEntries).map(([k,v])=>({key:k,...v})),
    ...regionTopics,
    ...factionTopics
  ];
  select.innerHTML = entries.map((e)=>`<option value="${e.key}">${e.title}</option>`).join('');
  select.onchange = () => {
    const e = entries.find((x)=>x.key===select.value);
    document.getElementById('codex-content').innerText = e.body;
  };
  select.dispatchEvent(new Event('change'));
}

function bindMapClick() {
  const handleMapSelection = (clientX, clientY) => {
    if (!state) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) * canvas.width) / rect.width;
    const y = ((clientY - rect.top) * canvas.height) / rect.height;
    const hit = regions.find((r)=>Math.abs(r.x-x)<18 && Math.abs(r.y-y)<12);
    if (hit) {
      state.selectedRegion = hit.id;
      renderAll();
    }
  };

  canvas.addEventListener('pointerup', (e)=> {
    handleMapSelection(e.clientX, e.clientY);
  });
}

function bindStaticUI() {
  document.getElementById('btn-new-game').onclick = ()=>document.getElementById('menu-modal').classList.add('open');
  document.getElementById('btn-end-turn').onclick = endTurn;
  document.getElementById('btn-save').onclick = ()=>localStorage.setItem('pathogenDominionSave', JSON.stringify(state));
  document.getElementById('btn-load').onclick = ()=>{
    const data = localStorage.getItem('pathogenDominionSave');
    if (data) { state = JSON.parse(data); renderAll(); }
  };
  document.getElementById('btn-export').onclick = ()=>{
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pathogen-dominion-turn-${state.turn}.json`;
    a.click();
  };
  document.getElementById('import-file').onchange = (e)=>{
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { state = JSON.parse(reader.result); renderAll(); };
    reader.readAsText(file);
  };
  document.getElementById('btn-settings').onclick = ()=>document.getElementById('settings-modal').classList.add('open');
  document.getElementById('btn-close-settings').onclick = ()=>document.getElementById('settings-modal').classList.remove('open');
  document.getElementById('scanline-toggle').onchange = (e)=>document.body.classList.toggle('scanlines', e.target.checked);
}

function bindDynamicUI() {
  document.querySelectorAll('[data-target]').forEach((btn)=>btn.onclick = ()=> {
    const result = spreadToRegion(state, btn.dataset.target);
    log(result.message);
    renderAll();
  });
  document.querySelectorAll('[data-research]').forEach((btn)=>btn.onclick = ()=> {
    const result = buyResearch(state, btn.dataset.research);
    log(result.msg);
    renderAll();
  });
  const fort = document.getElementById('btn-fortify');
  if (fort) fort.onclick = ()=>{
    log(fortifyRegion(state, state.selectedRegion) ? 'Reservoir established.' : 'Cannot establish reservoir here.');
    renderAll();
  };
}

function endTurn() {
  if (!state) return;
  applyEndTurnEconomy(state);
  log(runImmunePhase(state));
  const ev = rollEvent(state);
  if (ev) log(ev);
  state.turn += 1;
  const verdict = checkVictoryLoss(state);
  if (verdict.done) {
    log(`${verdict.title}: ${verdict.text}`);
    alert(`${verdict.title}\n${verdict.text}`);
  }
  renderAll();
}

function renderAll() {
  if (!state) return;
  renderMap(state, canvas);
  renderPanels(state);
  bindDynamicUI();
}

setupFactionMenu();
bindMapClick();
bindStaticUI();
