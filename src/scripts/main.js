const surfSpots = {
  main: {
    label: 'Capitola',
    surf: '4-6 ft',
    condition: 'Fair • Winds: 5 mph WNW',
    swell: '260° W • 2.9 ft',
    wind: '5 mph WNW',
    tide: '1.2 ft Rising',
    water: '59°',
  },
  jetty: {
    label: 'Capitola Jetty',
    surf: '4-6 ft',
    condition: 'Glass • Winds: 3 mph W',
    swell: '261° W • 3.1 ft',
    wind: '3 mph W',
    tide: '1.0 ft Rising',
    water: '59°',
  },
  seabright: {
    label: 'Seabright Beach',
    surf: '2-3 ft',
    condition: 'Good • Winds: 1 mph SW',
    swell: '197° SW • 2.6 ft',
    wind: '1 mph SW',
    tide: '1.5 ft Rising',
    water: '59°',
  },
};

const hourlyData = [
  { time: 'Now', temp: '60°', desc: 'Sunny' },
  { time: '10 AM', temp: '63°', desc: 'Sunny' },
  { time: '12 PM', temp: '66°', desc: 'Sunny' },
  { time: '2 PM', temp: '64°', desc: 'Sunny' },
  { time: '4 PM', temp: '59°', desc: 'Sunny' },
  { time: '6 PM', temp: '58°', desc: 'Sunny' },
];

const tides = [
  { label: '12 AM', meta: 'High', value: '4.7 ft' },
  { label: '6 AM', meta: 'Low', value: '1.2 ft' },
  { label: '12 PM', meta: 'High', value: '4.2 ft' },
  { label: '6 PM', meta: 'Low', value: '0.9 ft' },
];

const beaches = [
  { name: 'Capitola Beach', detail: 'Lifeguard on duty' },
  { name: 'Manresa State Beach', detail: 'Wide open swim lanes' },
  { name: 'Seacliff Beach', detail: 'Great morning sessions' },
  { name: 'New Brighton Beach', detail: 'Beginner friendly' },
];

const restaurants = [
  { name: 'Paradise Beach Grille', detail: 'Seafood • Capitola Village' },
  { name: 'Sanders Café', detail: 'Coffee & light bites' },
  { name: 'Zelda’s on the Beach', detail: 'Oceanfront dining' },
  { name: 'Maka’s Surfside', detail: 'Tacos & live music' },
];

const events = [
  { title: 'Sunset Beach Yoga', detail: 'Capitola Beach', time: 'Tonight at 6 PM' },
  { title: 'Morning Beach Yoga', detail: '30 mins along the coast', time: 'Daily at 6 AM' },
  { title: 'Live Music: The Wave Riders', detail: 'Capitola Beach', time: 'Saturday 7 PM' },
  { title: 'Local Art Walk', detail: 'Capitola Village', time: 'Sunday 2 PM' },
];

function renderHourly() {
  const container = document.getElementById('hourly-forecast');
  container.innerHTML = '';
  hourlyData.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'hourly__item';
    card.innerHTML = `
      <p class="hourly__time">${item.time}</p>
      <p class="hourly__temp">${item.temp}</p>
      <p class="muted">${item.desc}</p>
    `;
    container.appendChild(card);
  });
}

function renderTides() {
  const container = document.getElementById('tide-list');
  container.innerHTML = '';
  tides.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'tide__item';
    row.innerHTML = `
      <div>
        <p class="tide__label">${item.label}</p>
        <p class="tide__meta">${item.meta}</p>
      </div>
      <p class="tide__value">${item.value}</p>
    `;
    container.appendChild(row);
  });
}

function renderSimpleList(targetId, list) {
  const container = document.getElementById(targetId);
  container.innerHTML = '';
  list.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.name}</strong>
      <span>${item.detail}</span>
    `;
    container.appendChild(li);
  });
}

function renderEvents() {
  const container = document.getElementById('events-list');
  container.innerHTML = '';
  events.forEach((event) => {
    const card = document.createElement('article');
    card.className = 'card event-card';
    card.innerHTML = `
      <div class="tag tag--accent">${event.time}</div>
      <h4>${event.title}</h4>
      <p>${event.detail}</p>
    `;
    container.appendChild(card);
  });
}

function updateSurf(spotKey) {
  const spot = surfSpots[spotKey];
  document.getElementById('surf-height').textContent = spot.surf;
  document.getElementById('surf-condition').textContent = `${spot.condition}`;
  document.getElementById('swell').textContent = spot.swell;
  document.getElementById('wind').textContent = spot.wind;
  document.getElementById('tide').textContent = spot.tide;
  document.getElementById('water-temp').textContent = spot.water;
}

function bindSpotToggle() {
  const buttons = document.querySelectorAll('.spot-toggle__btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((other) => other.setAttribute('aria-selected', 'false'));
      btn.setAttribute('aria-selected', 'true');
      updateSurf(btn.dataset.spot);
    });
  });
}

function init() {
  renderHourly();
  renderTides();
  renderSimpleList('beach-list', beaches);
  renderSimpleList('restaurant-list', restaurants);
  renderEvents();
  updateSurf('main');
  bindSpotToggle();
}

document.addEventListener('DOMContentLoaded', init);
