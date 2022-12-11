const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  //finding  latitude and longitude using city name
  const cityName = req.body.cityName;

  const key = "2d1819926f23fdaddda0d1e42468128a";

  const cityURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${key}`;

  https.get(cityURL, function (cityResponse) {
    cityResponse.on("data", function (data) {
      const cityData = JSON.parse(data);
      const lat = cityData[0].lat;
      const lon = cityData[0].lon;

      //using the longitude and latitude for finding temperature
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;

      https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (weatherdata) {
          const weatherData = JSON.parse(weatherdata);
          const temp = weatherData.main.temp;
          const description = weatherData.weather[0].description;
          const icon = weatherData.weather[0].icon;
          const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

          res.write("<p> The weather is currently " + description + "<p>");
          res.write(
            `<h1> The temperature in ${cityName} is ${temp} degree Celsius </h1>`
          );
          res.write(`<img src=" ${imageURL}">`);
          res.send();
        });
      });
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
