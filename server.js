const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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

async function handleWeatherRequest(req, res, reqUrl) {
  if (!WEATHER_API_KEY) {
    return sendJson(res, 500, { error: 'Server is missing WEATHER_API_KEY configuration.' });
  }

  const zip = (reqUrl.searchParams.get('zip') || '').trim();
  if (!/^\d{5}$/.test(zip)) {
    return sendJson(res, 400, { error: 'Please provide a valid 5-digit U.S. ZIP code.' });
  }

  const upstreamUrl = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(WEATHER_API_KEY)}&q=${encodeURIComponent(zip)}&days=6&aqi=no&alerts=no`;

  try {
    const upstreamRes = await fetch(upstreamUrl);
    const payload = await upstreamRes.json();

    if (!upstreamRes.ok || payload.error) {
      const message = payload?.error?.message || 'Unable to fetch weather.';
      return sendJson(res, upstreamRes.ok ? 502 : upstreamRes.status, { error: message });
    }

    return sendJson(res, 200, payload);
  } catch (error) {
    return sendJson(res, 502, { error: 'Weather service request failed.' });
  }
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
