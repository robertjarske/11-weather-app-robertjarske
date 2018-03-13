import { convertUnix } from "../converters/unixConverter";
import { windDeg } from "../converters/windDirection";

export function fetchCityNow(cityname) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=806af346335195477bb426c79a997f1f`
  )
    .then(res => res.json())
    .then(res => {
      if (res.cod === 200) {
        let object = {};
        object.city = res.name;
        object.countryCode = res.sys.country;

        object.sun = {
          sunrise: [],
          sunset: []
        };

        object.dateTime = {
          date: [],
          time: []
        };

        object.coordinates = res.coord;
        object.climate = {
          temp: res.main.temp,
          humidity: res.main.humidity
        };

        object.weather = {
          description: res.weather[0].description,
          icon: res.weather[0].icon
        };

        object.wind = {
          speed: res.wind.speed,
          degrees: res.wind.deg
        };

        object.sun.sunrise = convertUnix(res.sys.sunrise).slice(-5);
        object.sun.sunset = convertUnix(res.sys.sunset).slice(-5);
        object.dateTime.date = convertUnix(res.sys.sunset).slice(0, -7);
        object.dateTime.time = new Date();

        object.windDirection = windDeg(res.wind.deg);
        object.error = null;

        return object;
      } else {
        let object = {};
        object.error = `City "${cityname}" not found!`;
        return object;
      }
    });
}

export function fetchLocalNow(latitude, longitude) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=806af346335195477bb426c79a997f1f`
  )
    .then(res => res.json())
    .then(res => {
      let object = {};
      object.city = res.name;
      object.countryCode = res.sys.country;

      object.sun = {
        sunrise: [],
        sunset: []
      };

      object.dateTime = {
        date: [],
        time: []
      };

      object.coordinates = res.coord;
      object.climate = {
        temp: res.main.temp,
        humidity: res.main.humidity
      };

      object.weather = {
        description: res.weather[0].description,
        icon: res.weather[0].icon
      };

      object.wind = {
        speed: res.wind.speed,
        degrees: res.wind.deg
      };

      object.sun.sunrise = convertUnix(res.sys.sunrise).slice(-5);
      object.sun.sunset = convertUnix(res.sys.sunset).slice(-5);
      object.dateTime.date = convertUnix(res.sys.sunset).slice(0, -7);
      object.dateTime.time = new Date();

      object.windDirection = windDeg(res.wind.deg);

      object.error = null;

      return object;
    });
}

export function fetchForecast(cityname, cnt) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=806af346335195477bb426c79a997f1f&units=metric&cnt=${cnt}`
  )
    .then(res => res.json())
    .then(res => {
      return res;
    });
}

export function getPromiseDataFromArray(promises) {
  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(res => {
        return res;
      })
      .then(res => {
        Promise.all(res).then(resolve);
      })
      .catch(reject);
  });
}
