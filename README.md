# Capitola Companion

A modular surf, weather, and travel companion for Capitola, CA inspired by the provided mobile reference. The page is structured into reusable sections (hero, surf report, hourly forecast, tide & swell, explore, and local events) with placeholder notes for future API integrations.

## Developing
Open `index.html` in your browser or serve locally (e.g., `python -m http.server`). Styles live in `src/styles/main.css` and interactive behavior lives in `src/scripts/main.js`.

## Testing
Run the included script to document the current manual visual checks:

```bash
npm test
```

Visual QA focuses on responsive layouts, button interactions for surf spots, and card rendering across breakpoints.
