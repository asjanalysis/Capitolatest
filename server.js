const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const WEATHER_UPSTREAM_TIMEOUT_MS = 10000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readWeatherApiKey() {
  const keyCandidates = [
    process.env.WEATHER_API_KEY,
    process.env.WEATHERAPI_KEY,
    process.env.WEATHER_API_TOKEN,
  ];

  for (const rawValue of keyCandidates) {
    if (!rawValue) continue;

    const trimmed = String(rawValue).trim();
    if (!trimmed) continue;

    // Recover from accidental values like: WEATHER_API_KEY=abcd1234
    const withoutPrefix = trimmed.replace(/^WEATHER(?:_API)?_KEY\s*=\s*/i, '');
    const unquoted = withoutPrefix.replace(/^['"]|['"]$/g, '').trim();

    if (unquoted) {
      return unquoted;
    }
  }

  return '';
}

async function readJsonSafely(response) {
  const raw = await response.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return { rawBody: raw.slice(0, 200) };
  }
}

function buildForecastUrl(zip, apiKey, days) {
  return `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(zip)}&days=${days}&aqi=no&alerts=no`;
}

async function fetchForecastFromUpstream(zip, apiKey) {
  const forecastDayCandidates = [6, 5, 3];

  for (const days of forecastDayCandidates) {
    const upstreamUrl = buildForecastUrl(zip, apiKey, days);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEATHER_UPSTREAM_TIMEOUT_MS);

    try {
      const upstreamRes = await fetch(upstreamUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      const payload = await readJsonSafely(upstreamRes);

      if (upstreamRes.ok && !payload.error) {
        return { ok: true, payload };
      }

      const message = payload?.error?.message || 'Unable to fetch weather.';
      const daysLimitMessage = /days/i.test(message);
      const hasFallbackCandidate = days !== forecastDayCandidates[forecastDayCandidates.length - 1];

      if (upstreamRes.status === 400 && daysLimitMessage && hasFallbackCandidate) {
        continue;
      }

      return {
        ok: false,
        status: upstreamRes.ok ? 502 : upstreamRes.status,
        message,
      };
    } catch (error) {
      if (error && error.name === 'AbortError') {
        return {
          ok: false,
          status: 504,
          message: 'Weather service timed out. Please try again.',
        };
      }

      return {
        ok: false,
        status: 502,
        message: 'Weather service request failed.',
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    ok: false,
    status: 502,
    message: 'Unable to fetch weather.',
  };
}

async function handleWeatherRequest(req, res, reqUrl) {
  const weatherApiKey = readWeatherApiKey();
  if (!weatherApiKey) {
    return sendJson(res, 500, {
      error: 'Server is missing WEATHER_API_KEY configuration.',
      help: 'Set WEATHER_API_KEY (or WEATHERAPI_KEY) to your WeatherAPI key.',
    });
  }

  const zip = (reqUrl.searchParams.get('zip') || '').trim();
  if (!/^\d{5}$/.test(zip)) {
    return sendJson(res, 400, { error: 'Please provide a valid 5-digit U.S. ZIP code.' });
  }

  const result = await fetchForecastFromUpstream(zip, weatherApiKey);
  if (!result.ok) {
    return sendJson(res, result.status, { error: result.message });
  }

  return sendJson(res, 200, result.payload);
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && reqUrl.pathname === '/api/weather') {
    return handleWeatherRequest(req, res, reqUrl);
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
    return;
  }

  let filePath = reqUrl.pathname === '/' ? '/index.html' : reqUrl.pathname;
  filePath = path.join(process.cwd(), filePath);

  if (!filePath.startsWith(process.cwd())) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  serveStaticFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Retro Weather Channel server listening on http://localhost:${PORT}`);
});
