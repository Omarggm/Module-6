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
      console.log("Forecast data:", data);
      for(let i = 0; i < 7; i++) {
       const temperature = data.list[i].main.temp;

       console.log("Day", i + 1, "Temperature:", temperature + "°F");
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
      console.log("Received coordinates:", coordinates);
      getForecast(coordinates.latitude, coordinates.longitude);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Example usage
getWeather("Bakersfield")
  .then((coordinates) => {
    console.log("Example coordinates:", coordinates);
    return getForecast(coordinates.latitude, coordinates.longitude);
  })
  .catch((error) => {
    console.error(error);
  });
