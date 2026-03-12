# Pathogen Dominion

Pathogen Dominion is a static, browser-based, turn-based strategy game inspired by Civ-style empire progression, reimagined inside a single human host. You select a pathogen archetype, expand across anatomically connected tissue regions, evolve adaptations with tradeoffs, survive escalating immune pressure, and pursue multiple victory paths without collapsing the host too early.

## 1) Project plan

### Architecture overview
- **Rendering/UI:** `index.html`, `src/css/styles.css`, `src/js/ui/render.js`.
- **State + rules:** `src/js/core/` modules for state creation, spread mechanics, immune phase, events, and win/loss checks.
- **Data-driven content:** `src/js/data/` defines regions, factions, adaptation tree, random events, and codex entries.
- **Entry point:** `src/js/main.js` wires turn loop, input, save/load/import/export, codex, and menus.

### Feature breakdown
- Main menu and faction selection
- Anatomical body map with adjacency/pathway spread constraints
- Tissue-based colonization mechanics with barriers and tropism constraints
- Adaptation tree with prerequisites and tradeoffs
- Layered immune response and random host/medical events
- Resources economy and host viability tension
- Victory/loss conditions
- Save/load via localStorage and JSON import/export
- In-game codex and tooltips/text explanations

### Implementation phases
1. Establish data model and static shell.
2. Build turn loop + spread + immune + event systems.
3. Add adaptation tree and faction asymmetry.
4. Add save/load/export/import and codex.
5. Polish retro UI styling and documentation.

## 2) Repository structure

```text
.
├─ index.html
├─ docs/
│  └─ SCIENTIFIC_NOTES.md
├─ src/
│  ├─ css/
│  │  └─ styles.css
│  └─ js/
│     ├─ main.js
│     ├─ core/
│     │  ├─ state.js
│     │  ├─ mechanics.js
│     │  ├─ immune.js
│     │  └─ events.js
│     ├─ data/
│     │  ├─ regions.js
│     │  ├─ factions.js
│     │  ├─ research.js
│     │  ├─ events.js
│     │  └─ codex.js
│     └─ ui/
│        └─ render.js
└─ assets/
   └─ icons/ (placeholder for future sprite/UI atlases)
```

## 3) Local run

No backend needed.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## 4) GitHub Pages publish

1. Push this repo to GitHub.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select `main` (or your default branch) and root `/`.
4. Save. GitHub Pages serves `index.html` directly.

## 5) Controls
- **Mouse click region:** select tissue
- **Action panel buttons:** spread to connected regions
- **End Turn:** resolve economy, immune, and events
- **Adaptation Tree:** buy mutation/adaptation unlocks using Genetic Diversity
- **Save/Load:** localStorage
- **Export/Import:** JSON save files

## 6) Notes
- This game is an educationally flavored strategy abstraction.
- It intentionally avoids wet-lab procedures or real-world pathogen engineering instructions.
