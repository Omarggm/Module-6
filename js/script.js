const apiKey = "45bf7d160c6f597ac794873819cece70";
const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city");
const searchHistory = document.querySelector("#search-history");
const searchList = document.querySelector("#history-list");

// Load search history from local storage
let savedSearches = [];

if (localStorage.getItem("searches")) {
  savedSearches = JSON.parse(localStorage.getItem("searches"));
}

// Function to save a search to the local storage
function saveSearch(cityName) {
  savedSearches.push(cityName);
  localStorage.setItem("searches", JSON.stringify(savedSearches));
}

// Function to display search history
function displaySearchHistory() {
  searchList.innerHTML = ""; // Clear search history container

  const uniqueCities = [...new Set(savedSearches)].slice(-5).reverse();

  uniqueCities.forEach((cityName) => {
    const searchItem = document.createElement("div");
    searchItem.textContent = cityName;
    searchItem.classList.add("search-item");
    searchItem.addEventListener("click", () => {
      cityInput.value = cityName;
      searchForm.dispatchEvent(new Event("submit"));
    });
    searchList.appendChild(searchItem);
  });
}

// Call the function to display search history on page load
displaySearchHistory();

async function getWeather(cityName) {
  // Save the search to local storage
  saveSearch(cityName);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`
    );

    if (!response.ok) {
      throw new Error("Error: " + response.status);
    }

    const data = await response.json();

    const temperature = data.main.temp;
    const tempIcon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const currentDate = new Date().toLocaleDateString();

    const currentWeatherHTML = `
      <div>
        <p>Date: ${currentDate}</p>
        <p>Temperature: ${temperature}</p>
        <p><img src="https://openweathermap.org/img/w/${tempIcon}.png" alt="Weather Icon"></p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed}mph</p>
      </div>
    `;

    todayContainer.innerHTML = currentWeatherHTML;

    if (data.coord && data.coord.lat && data.coord.lon) {
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;
      return { latitude, longitude };
    } else {
      throw new Error("Invalid API response");
    }

    forecastContainer.innerHTML = ""; // Clear the forecast container before fetching forecast

    const coordinates = await getForecast(coordinates.latitude, coordinates.longitude);

    // Update the search history display
    displaySearchHistory();

  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
}

async function getForecast(latitude, longitude) {
  forecastContainer.innerHTML = ""; // Clear the forecast container

  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error: " + response.status);
      }
    })
    .then((data) => {
      const sevenDayForecast = data.list;
      //console.log("7-day forecast:", sevenDayForecast);
      const cityName = data.city.name;
      //console.log("City:", cityName);

      const loggedDates = [];
      for (let i = 0; i < data.list.length; i++) {
        const date = new Date(sevenDayForecast[i].dt_txt);
        const formattedDate = date.toLocaleDateString();

        // Check if the date has already been logged
        if (!loggedDates.includes(formattedDate)) {
          loggedDates.push(formattedDate);

          const temperature = sevenDayForecast[i].main.temp;
          const tempIcon = sevenDayForecast[i].weather[0].icon;
          const humidity = sevenDayForecast[i].main.humidity;
          const windSpeed = sevenDayForecast[i].wind.speed;
          console.log(
            "Date:",
            formattedDate,
            "Temperature:",
            temperature,
            "Icon:",
            tempIcon,
            "Humidity:",
            humidity + "%",
            "Wind Speed:",
            windSpeed + "mph"
          );

          const forecastHTML = `
          <div>
          <p>Date: ${formattedDate}</p>
          <p>Temperature: ${temperature}</p>
          <p><img src="https://openweathermap.org/img/w/${tempIcon}.png" alt="Weather Icon"></p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed}mph</p>
          </div>
          `;
          forecastContainer.innerHTML += forecastHTML;
        }
      }
    })
    .catch((error) => {
      console.error("Forecast API Error:", error);
      throw error;
    });
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const cityName = cityInput.value;
  getWeather(cityName)
    .then((coordinates) => {
      getForecast(coordinates.latitude, coordinates.longitude);
    })
    .catch((error) => {
      console.error(error);
    });
});

const forecastContainer = document.querySelector("#forecast-container");
const todayContainer = document.querySelector("#today-container");
