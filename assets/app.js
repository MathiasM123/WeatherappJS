const $loader = document.getElementById('loader');
const $weather = document.getElementById('weather');

const daysofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

async function getLocation(lat, lon) {
  const apiKey = 'your-c26c80dc026bfa13b6a942c1aaface15-api-key-here';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${apiKey}`;

  const response = await fetch(url);
  const json = await response.json();
  json.features.forEach((feature) => {
    if (feature.place_type[0] === 'locality') {
      document.getElementById('location').innerHTML = feature.text;
    }
  });
}

async function getWeather(lat, lon) {
  const apiKey = 'c26c80dc026bfa13b6a942c1aaface15';
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const json = await response.json();

  for (let i = 0; i < json.daily.length; i++) {
    const day = json.daily[i];
    const $elem = document.createElement('div');
    const $icon = document.createElement('img');
    const $temp = document.createElement('p');
    const $desc = document.createElement('p');
    const $day = document.createElement('p');

    $icon.src = `images/weather/${day.weather[0].icon}.png`;
    $temp.innerHTML = `${Math.round(day.temp.day)}°C`;
    $desc.innerHTML = day.weather[0].description;

    const date = new Date(day.dt * 1000);
    $day.innerHTML = daysofweek[date.getDay()];

    $elem.appendChild($icon);
    $elem.appendChild($temp);
    $elem.appendChild($desc);
    $elem.appendChild($day);

    $weather.appendChild($elem);
  }

  $loader.style.display = 'none';
  $weather.style.display = 'flex';
}

function success(position) {
  getWeather(position.coords.latitude, position.coords.longitude);
  getLocation(position.coords.latitude, position.coords.longitude);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

navigator.geolocation.getCurrentPosition(success, error, options);
