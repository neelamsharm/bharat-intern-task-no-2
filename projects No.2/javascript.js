document.getElementById('get-weather').addEventListener('click', function() {
  const city = document.getElementById('city-input').value;
  const apiKey = 'f7f59e2685598d932267bf62f49f821e';  // Your OpenWeatherMap API key
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        document.getElementById('city-name').innerText = data.name;
        document.getElementById('weather-condition').innerText = data.weather[0].main;
        document.getElementById('temperature').innerText = `Temperature: ${data.main.temp} °C`;

        // Fetch forecast data
        fetch(forecastWeatherUrl)
          .then(response => response.json())
          .then(forecastData => {
            const forecastList = forecastData.list;
            const today = new Date().getDay();
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            // Create a map to store daily forecasts
            const dailyForecasts = {};

            // Populate dailyForecasts map
            forecastList.forEach(forecast => {
              const date = new Date(forecast.dt_txt);
              const dayName = dayNames[date.getDay()];
              if (!dailyForecasts[dayName]) {
                dailyForecasts[dayName] = [];
              }
              dailyForecasts[dayName].push(forecast.main.temp);
            });

            // Determine the next three days from today
            for (let i = 1; i <= 3; i++) {
              const nextDay = (today + i) % 7;
              const dayName = dayNames[nextDay];
              const temps = dailyForecasts[dayName] || [];
              const avgTemp = temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : 'N/A';

              document.getElementById(`day-${i}`).innerText = dayName;
              document.getElementById(`temp-day-${i}`).innerText = `Temp: ${avgTemp} °C`;
            }
          });
      } else {
        alert('City not found. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error fetching the weather data:', error);
      alert('Could not retrieve weather data. Please try again.');
    });
});
