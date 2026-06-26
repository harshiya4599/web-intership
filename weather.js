const statusEl = document.getElementById("api-status");
const placeEl = document.getElementById("weather-place");
const mainEl = document.getElementById("weather-main");
const extraEl = document.getElementById("weather-extra");
const helpEl = document.getElementById("spelling-help");

const cityInput = document.getElementById("city-input");
const citySuggestions = document.getElementById("city-suggestions");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");

let suggestTimer = null;

function mapWeatherCode(code, isDay) {
  const dayNight = isDay ? "day" : "night";

  const map = {
    0: dayNight === "day" ? "Sunny" : "Clear Night",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Cloudy",
    45: "Foggy",
    48: "Foggy",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Dense Drizzle",
    61: "Light Rain",
    63: "Rainy",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Snowy",
    75: "Heavy Snow",
    80: "Rain Showers",
    82: "Heavy Showers",
    95: "Thunderstorm"
  };

  return map[code] || "Unknown";
}

function weatherSymbolHtml(label) {
  if (label.includes("Sunny") || label.includes("Clear")) return "&#9728;";
  if (label.includes("Cloud")) return "&#9729;";
  if (label.includes("Rain") || label.includes("Drizzle") || label.includes("Showers")) return "&#127783;";
  if (label.includes("Snow")) return "&#10052;";
  if (label.includes("Thunder")) return "&#9928;";
  if (label.includes("Fog")) return "&#127787;";
  return "&#127777;";
}

async function fetchWeatherByCoords(lat, lon, placeName) {
  statusEl.textContent = "Loading weather...";
  placeEl.textContent = "";
  mainEl.textContent = "";
  extraEl.textContent = "";

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m,is_day&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API failed: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;

    const condition = mapWeatherCode(current.weather_code, current.is_day === 1);
    const symbol = weatherSymbolHtml(condition);

    statusEl.textContent = "Weather loaded";
    placeEl.textContent = placeName;
    mainEl.innerHTML = `${symbol} ${condition} | ${current.temperature_2m} deg C`;
    extraEl.textContent = `Humidity: ${current.relative_humidity_2m}% | Cloud Cover: ${current.cloud_cover}% | Wind: ${current.wind_speed_10m} km/h`;
  } catch (error) {
    statusEl.textContent = "Error";
    mainEl.textContent = "Could not fetch weather now.";
    extraEl.textContent = "Please try again after some time.";
  }
}

async function searchByCity() {
  const city = cityInput.value.trim();
  if (!city) {
    statusEl.textContent = "Enter a city name.";
    return;
  }

  statusEl.textContent = "Searching city...";
  placeEl.textContent = "";
  mainEl.textContent = "";
  extraEl.textContent = "";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
    const geoRes = await fetch(geoUrl);

    if (!geoRes.ok) {
      throw new Error(`Geocoding failed: ${geoRes.status}`);
    }

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      statusEl.textContent = "City not found.";
      helpEl.textContent = "Check spelling and try again.";
      return;
    }

    const result = geoData.results[0];
    const placeName = `${result.name}, ${result.country}`;
    cityInput.value = result.name;

    if (city.toLowerCase() !== result.name.toLowerCase()) {
      helpEl.textContent = `Showing closest match: ${result.name}`;
    } else {
      helpEl.textContent = "";
    }

    fetchWeatherByCoords(result.latitude, result.longitude, placeName);
  } catch (error) {
    statusEl.textContent = "Error";
    mainEl.textContent = "Could not search city.";
    extraEl.textContent = "Please try again.";
  }
}

async function suggestCities() {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    citySuggestions.innerHTML = "";
    return;
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) return;

    const data = await response.json();
    citySuggestions.innerHTML = "";

    (data.results || []).forEach((city) => {
      const option = document.createElement("option");
      option.value = city.name;
      option.label = `${city.name}, ${city.country}`;
      citySuggestions.appendChild(option);
    });
  } catch (error) {
    citySuggestions.innerHTML = "";
  }
}

function fetchByLocation() {
  if (!navigator.geolocation) {
    statusEl.textContent = "Geolocation not supported in this browser.";
    return;
  }

  statusEl.textContent = "Getting your location...";
  helpEl.textContent = "";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude, "Your Current Location");
    },
    () => {
      statusEl.textContent = "Location access denied.";
      mainEl.textContent = "Allow location or search by city.";
      extraEl.textContent = "";
    }
  );
}

searchBtn.addEventListener("click", searchByCity);
locationBtn.addEventListener("click", fetchByLocation);
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchByCity();
});

cityInput.addEventListener("input", () => {
  clearTimeout(suggestTimer);
  suggestTimer = setTimeout(suggestCities, 250);
});
