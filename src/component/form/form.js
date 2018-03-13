import React, { Component } from "react";
import {
  fetchCityNow,
  fetchLocalNow,
  fetchForecast,
  getPromiseDataFromArray
} from "../api/api";
import Day from "../day/day";
import "./form.css";
import FiveDays from "../fiveDays/fiveDays";

class Form extends Component {
  constructor() {
    super();
    this.state = {
      city: [],
      countryCode: [],
      sun: {
        sunrise: [],
        sunset: []
      },
      dateTime: {
        date: [],
        time: []
      },
      coordinates: {
        lat: [],
        lon: []
      },
      climate: {
        temp: [],
        humidity: []
      },
      weather: {
        description: [],
        icon: []
      },
      wind: {
        speed: [],
        degrees: []
      },
      windDirection: [],
      forecast: [],
      error: null,
      fiveDayForecast: false,
      isCelsius: true,
      unit: "C"
    };
  }

  toFahrenheit(celsius) {
    let fahrenheit = ((celsius - 32) * 5 / 9).toFixed(2);

    this.setState({
      climate: {
        temp: fahrenheit,
        humidity: this.state.climate.humidity
      }
    });
  }

  toCelsius(fahrenheit) {
    let celsius = (fahrenheit * 9 / 5 + 32).toFixed(2);

    this.setState({
      climate: {
        temp: celsius,
        humidity: this.state.climate.humidity
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const city = e.nativeEvent.target.elements[0].value;

    const apiCalls = [fetchCityNow(city), fetchForecast(city, 8)];

    getPromiseDataFromArray(apiCalls)
      .then(res => {
        res[0].error == null
          ? this.setState({
              city: res[0].city,
              countryCode: res[0].countryCode,
              sun: {
                sunrise: res[0].sun.sunrise,
                sunset: res[0].sun.sunset
              },
              dateTime: {
                date: res[0].dateTime.date,
                time: res[0].dateTime.time
              },
              coordinates: {
                lat: res[0].coordinates.lat,
                lon: res[0].coordinates.lon
              },
              climate: {
                temp: res[0].climate.temp,
                humidity: res[0].climate.humidity
              },
              weather: {
                description: res[0].weather.description,
                icon: res[0].weather.icon
              },
              wind: {
                speed: res[0].wind.speed,
                degrees: res[0].wind.degrees
              },
              windDirection: res[0].windDirection,
              error: res[0].error,
              forecast: res[1].list
            })
          : this.setState({
              error: res[0].error
            });
      })
      .catch(reason => {
        console.log(reason);
      });
  }

  getFiveDayForecast() {
    this.setState({
      fiveDayForecast: true
    });
  }

  onChange() {
    this.state.unit === "C"
      ? this.setState({
          unit: "F"
        })
      : this.setState({
          unit: "C"
        });
    this.setState(
      prevState => ({
        isCelsius: !prevState.isCelsius
      }),
      function() {
        this.state.isCelsius
          ? this.toFahrenheit(this.state.climate.temp)
          : this.toCelsius(this.state.climate.temp);
      }
    );
  }

  getLocation() {
    let that = this;
    navigator.geolocation.getCurrentPosition(function(position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      fetchLocalNow(lat, lon).then(res => {
        that.setState(
          {
            city: res.city,
            countryCode: res.countryCode,
            sun: {
              sunrise: res.sun.sunrise,
              sunset: res.sun.sunset
            },
            dateTime: {
              date: res.dateTime.date,
              time: res.dateTime.time
            },
            coordinates: {
              lat: res.coordinates.lat,
              lon: res.coordinates.lon
            },
            climate: {
              temp: res.climate.temp,
              humidity: res.climate.humidity
            },
            weather: {
              description: res.weather.description,
              icon: res.weather.icon
            },
            wind: {
              speed: res.wind.speed,
              degrees: res.wind.degrees
            },
            windDirection: res.windDirection,
            error: res.error
          },
          function() {
            fetchForecast(this.state.city, 8).then(res => {
              that.setState({
                forecast: res.list
              });
            });
          }
        );
      });
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" placeholder="Type city name here" name="city" />
          <button type="submit">Get the current weather</button>
        </form>
        <button onClick={this.getLocation.bind(this)}>
          Get the current weather for my location
        </button>
        {this.state.error !== null ? (
          <div className="error">{this.state.error}</div>
        ) : (
          ""
        )}
        {this.state.city.length > 0 ? (
          <div className="App-weather">
            <button onClick={this.getFiveDayForecast.bind(this)}>
              Get five day overview
            </button>
            <div>
              <label className="switch">
                <input
                  onChange={this.onChange.bind(this)}
                  value={this.state.isCelsius}
                  type="checkbox"
                />
                <span className="slider" />
              </label>
              <div className="units">
                <span className="c">&deg;{this.state.unit}</span>
              </div>
              <h2>
                {this.state.city}, {this.state.countryCode}
              </h2>
            </div>
            <p>
              Latitude: {this.state.coordinates.lat} | Longitude: {this.state.coordinates.lon}
            </p>
            <p>Date: {this.state.dateTime.date}</p>
            <p>
              Sunrise: {this.state.sun.sunrise} | Sunset: {this.state.sun.sunset}
            </p>
            <img
              src={`http://openweathermap.org/img/w/${
                this.state.weather.icon
              }.png`}
              alt="Weather icon"
            />
            <p>{this.state.weather.description}</p>
            <p>
              {this.state.climate.temp} &deg;{this.state.unit} | Humidity: {this.state.climate.humidity}%
            </p>
            <h3>Wind</h3>
            <div className="compass">
              <div className="direction">
                <p className="p">
                  {this.state.windDirection}
                  <span className="wind">{this.state.wind.speed}m/s</span>
                </p>
              </div>
              <div
                className="arrow"
                style={{ transform: `rotate(${this.state.wind.degrees}deg)` }}
              />
            </div>
          </div>
        ) : (
          <p>No results yet</p>
        )}
        {this.state.forecast && this.state.forecast.length > 0 ? (
          <div className="App-forecast">
            <h3 className="forecast-title">Forecast for the next 24h</h3>
            {this.state.forecast.map((interval, index) => {
              return (
                <Day
                  onChange={this.onChange.bind(this)}
                  isCelsius={this.state.isCelsius}
                  key={index}
                  interval={interval}
                />
              );
            })}
          </div>
        ) : (
          ""
        )}

        {this.state.fiveDayForecast ? (
          <div className="App-fiveDay">
            <h3 className="forecast-title">Forecast for the next five days</h3>
            <FiveDays isCelsius={this.state.isCelsius} city={this.state.city} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Form;
