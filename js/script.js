const apiKey = "45bf7d160c6f597ac794873819cece70";
const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city");

async function getWeather(cityName) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error: " + response.status);
      }
    })
    .then((data) => {
      if (data.coord && data.coord.lat && data.coord.lon) {
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        // console.log("Latitude:", latitude);
        // console.log("Longitude:", longitude);
        return { latitude, longitude };
      } else {
        throw new Error("Invalid API response");
      }
    })
    .then((coordinates) => {
      // console.log("Coordinates:", coordinates);
      return getForecast(coordinates.latitude, coordinates.longitude);
    })
    .catch((error) => {
      console.error("Weather API Error:", error);
      throw error;
    });
}

async function getForecast(latitude, longitude) {
const forecastContainer = document.querySelector("#forecast-container");
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
      // console.log("7-day forecast:", sevenDayForecast);
      const cityName = data.city.name;
      console.log("City:", cityName);

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
          // console.log(
          //   "Day",
          //   loggedDates.length,
          //   "Date:",
          //   formattedDate,
          //   "Temperature:",
          //   temperature,
          //   "Icon:",
          //   tempIcon,
          //   "Humidity:",
          //   humidity + "%",
          //   "Wind Speed:",
          //   windSpeed + "mph"
          // );

        
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

// Example usage
// getWeather("Bakersfield")
//   .then((coordinates) => {
//     return getForecast(coordinates.latitude, coordinates.longitude);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
