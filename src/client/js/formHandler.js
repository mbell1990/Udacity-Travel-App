//import fetch from "node-fetch";

// Usernamea and API Keys

const geonamesUrl = "http://api.geonames.org/searchJSON?q=";
const geonamesUsername = "matt.bell123";
//const weatherbitUrl = "https://api.weatherbit.io/v2.0/current";
const weatherbitUrl = "https://api.weatherbit.io/v2.0/forecast/daily";
const weatherbitApiKey = "ab81d9346d8945a9a203eda14cacbaa4";
const pixabayUrl = "https://pixabay.com/api/";
const pixabayApiKey = "31135970-406b562ad428e5ae275d760d0";

let trips = [];

// Function to get the latitude and longitude of a city using Geonames API
async function getLatLong(city) {
  const response = await fetch(
    `${geonamesUrl}${city}&maxRows=1&username=${geonamesUsername}`
  );
  const data = await response.json();
  const lat = data.geonames[0].lat;
  const lng = data.geonames[0].lng;
  return { lat, lng };
}

// Function to get the weather data of a city using Weatherbit API
async function getWeather(lat, lng, departureDate) {
  const response = await fetch(
    `${weatherbitUrl}/daily?lat=${lat}&lon=${lng}&key=${weatherbitApiKey}&start_date=${departureDate}&end_date=${departureDate}`
  );
  const data = await response.json();
  const weather = {
    description: data.data[0].weather.description,
    temperature: data.data[0].temp,
    icon: data.data[0].weather.icon,
  };
  return weather;
}

// Function to get a picture of a city using Pixabay API
async function getCityPicture(city) {
  const response = await fetch(
    `${pixabayUrl}?key=${pixabayApiKey}&q=${city}&image_type=photo&category=travel`
  );
  const data = await response.json();
  const picture = data.hits[0].webformatURL;
  return picture;
}

// Function to add a trip to the trips array and update the UI
function addTrip(city, weather, picture, daysleft) {
  const trip = { city, weather, picture, daysleft };
  trips.push(trip);
  updateUI();

  // Scroll to the newly added trip
  const tripsList = document.getElementById("trips-list");
  const newTripElement = tripsList.lastElementChild;
  newTripElement.scrollIntoView({ behavior: "smooth" });
}

// Function to handle form submission
async function handleSubmit(event) {
  event.preventDefault();
  const cityInput = document.getElementById("city-input");
  const city = cityInput.value;
  const { lat, lng } = await getLatLong(city);
  let departureDate = new Date(document.getElementById("departureDate").value)
    .toISOString()
    .slice(0, 10);
  const weather = await getWeather(lat, lng, departureDate);
  const picture = await getCityPicture(city);
  let today = new Date();
  let day = 1000 * 60 * 60 * 24;
  let difference_days = new Date(departureDate).getTime() - today.getTime();
  let daysleft = Math.abs(Math.ceil(difference_days / day));
  addTrip(city, weather, picture, daysleft);
  const tripData = { city, weather, picture, daysleft };
  saveTripData(tripData);
  clearInput();
}

function updateUI() {
  const tripsList = document.getElementById("trips-list");
  tripsList.innerHTML = "";
  trips.forEach((trip, index) => {
    const tripElement = document.createElement("div");
    tripElement.className = "trip-info";
    tripElement.innerHTML = `
      <img class ="trip-info__img" src="${trip.picture}" alt="${trip.city}">
      <div class="trip-info__content">
      <h2 class = "trip-info__city">${trip.city}</h2>
      <p>Your trip is in ${trip.daysleft} ${
      trip.daysleft === 1 ? "day" : "days"
    }</p>
      <p>Temperature: ${trip.weather.temperature} °C</p>
      <p>${trip.weather.description}</p>
      <img class="trip-info__icon" src ="../media/weatherbit_icons/${
        trip.weather.icon
      }.png">
      <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
      
    `;
    tripsList.appendChild(tripElement);

    // Add event listener to the delete button
    const deleteBtn = tripElement.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      removeTrip(index);
    });
  });
}

function removeTrip(index) {
  trips.splice(index, 1);
  updateUI();
}

// Function to save trip data to the server
async function saveTripData(data) {
  const response = await fetch("/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log(result);
}

// Add event listener to the form submit button
const form = document.getElementById("trip-form");
form.addEventListener("submit", handleSubmit);

function clearInput() {
  document.getElementById("city-input").value = "";
}

export { handleSubmit };
