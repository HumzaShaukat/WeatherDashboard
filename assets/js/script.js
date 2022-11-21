import { api_key } from "./config.js";
var searchHistoryList = document.querySelector("#searchHistory");
var searchBtn = document.querySelector("#searchBtn");
var searchInput = document.querySelector("#search");
var currentWeather = document.querySelector("#currentWeather");
var futureWeather = document.querySelector("#fiveDay");
var searchHistory = [];


function getCountryCoordinates(search) {
    var api_call = "http://api.openweathermap.org/geo/1.0/direct?q=" + search + "&limit=1" + api_key;
    fetch (api_call)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var lat = data[0].lat.toFixed(2);
        var long = data[0].lon.toFixed(2);
        getWeather(lat,long);
        }
      );
}

function getWeather(lat,long) {
  currentWeather.innerHTML = "";
  futureWeather.innerHTML = "";
    var weather_API = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial" + api_key;
    fetch(weather_API)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        printFiveDay();
        var count = 1;
        for (var i = 0; i < 40 ; i = i +7) {
          if (i == 0) {
            var cityName = $("<h2>").text(data.city.name + " " + dayjs().format("MM/DD/YYYY"));
            var icon = $("<i class = 'wi wi-owm-" + data.list[i].weather[0].id + "'></i>");
            var currentTemp = $("<h3>").text("Temperature: " + data.list[i].main.temp + " °F");
            var currentWind = $("<h3>").text("Wind: " + data.list[i].wind.speed + " MPH");
            var currentHumidity = $("<h3>").text("Humidity: " + data.list[i].main.humidity + "%");
            $("#currentWeather").append(cityName);
            $("#currentWeather").append(icon);
            $("#currentWeather").append(currentTemp);
            $("#currentWeather").append(currentWind);
            $("#currentWeather").append(currentHumidity);
          } else {
            var futureIcon = $("<i class = 'wi wi-owm-" + data.list[i].weather[0].id + "'/>");
            var futureTemp = $("<h3>").text("Temperature: " + data.list[i].main.temp + " °F");
            var futureWind = $("<h3>").text("Wind: " + data.list[i].wind.speed + " MPH");
            var futureHumidity = $("<h3>").text("Humidity: " + data.list[i].main.humidity + "%");
            $("#" + count).append(futureIcon);
            $("#" + count).append(futureTemp);
            $("#" + count).append(futureWind);
            $("#" + count).append(futureHumidity);
            count++;
          }
        }
      });
} 

function printFiveDay() {
  for (var i = 1; i < 6; i++) {
    var dayIndex = dayjs().add(i,"day").format("MM/DD/YYYY");
    var dayBox = $("<div id = '" + i +"' class = '" + "card'>");
    var dayLabel = $("<h2>").text(dayIndex);
    dayBox.append(dayLabel);
    $("#fiveDay").append(dayBox);
  }
}

function printSearchHistory(history) {
  searchHistoryList.innerHTML = "";
  for (var i = 0; i < history.length; i++) {
    var searchBtn = $("<button class = 'historyBtn'>");
    searchBtn.text(history[i]);
    $("#searchHistory").append(searchBtn);
  } 
}

$(function() {
  searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    $("#futureWeather").attr("style", "display: flex");
    $("#currentWeather").attr("style", "display: flex");
    var search = $("#search").val();
    if (search.trim() == "") {
      return;
    }
    if (JSON.parse(localStorage.getItem("searchHistory" !== null))) {
      searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
      printSearchHistory(searchHistory);
    }
    currentWeather.innerHTML = "";
    futureWeather.innerHTML = "";
    $("#search").val("");
    getCountryCoordinates(search);
    if (searchHistory.length < 5) {
      searchHistory.push(search);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      printSearchHistory(searchHistory);
    } else {
      searchHistory.shift();
      searchHistory.push(search);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      printSearchHistory(searchHistory);
    }
  });
  $("#searchHistory").click(function(event) {
    event.preventDefault();
    var historyEntry = event.target;
    if (historyEntry.matches("button") == true ) {
    search = historyEntry.textContent;
    getCountryCoordinates(search);
    }
  })
})