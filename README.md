# Retro Weather Channel

A single-page weather app styled after a classic 1990s Weather Channel screen.

## Features
- ZIP-code weather lookup for U.S. locations.
- Current conditions (temperature, feels-like, wind, pressure).
- Five-day forecast cards with retro-style presentation.
- User-controlled background MIDI track.
- Server-side WeatherAPI proxy that keeps your API key out of browser code.

## APIs Used
- [WeatherAPI Forecast API](https://www.weatherapi.com/docs/)

## Run
1. Set your WeatherAPI key as an environment variable (server-side only):
   - `WEATHER_API_KEY=711443e6b1264864b0f192935250901`
2. Start the app:
   - `npm start`
3. Open `http://localhost:3000`.

## Security notes
- The WeatherAPI key is read only by `server.js` from `WEATHER_API_KEY`.
- The browser now calls `/api/weather` and never receives or stores the raw key.
- Do **not** hardcode the key in `index.html` or commit `.env` files.
