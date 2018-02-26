import React, {Component} from 'react';
import { fetchForecast } from '../api/api';
import { convertTemperature } from '../converters/convertTemperature';

class FiveDays extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: this.props.city,
      countryCode: [],
			temp: [],
			wind: [],
			humidity: [],
      forecast: [],
      interval: [],
			error: null,
			isCelsius: true
    }
	}
	
	componentDidMount() {
		this.fetchFiveDayForecast(this.state.city);
	}

	componentWillReceiveProps(nextProps) {
    this.setState({
      isCelsius: nextProps.isCelsius
    })
  }

	renderTemperature = (temp) => {
    return (
      this.state.isCelsius === true
        ? `${convertTemperature(this.state.isCelsius, temp)} °C`
        : `${convertTemperature(this.state.isCelsius, temp)} °F`
    );
  }

  sortByDay(res) {
		return res.reduce((group, item) => {
				const valueToAdd = item['dt_txt'].substring(0, 10);

				group[valueToAdd] = group[valueToAdd] || [];
				group[valueToAdd].push(item);

				return group;
		}, {});
	}

	groupByMaxTemp(day) {
		return day.reduce((group, item) => {
			group.push(item.main.temp_max);
			return group;
		}, []);
	}

	groupByMinTemp(day) {
		return day.reduce((group, item) => {
			group.push(item.main.temp_min);
			return group;
		}, []);
	}

	groupByWind(day) {
		return day.reduce((group, item) => {
			group.push(item.wind.speed);
			return group;
		}, []);
	}

	groupByHum(day) {
		return day.reduce((group, item) => {
			group.push(item.main.humidity);
			return group;
		}, []);
  }
  
  fetchFiveDayForecast(city) {

  fetchForecast(city, 40).then(res => {
			let dates = this.sortByDay(res.list);

			let maxTemp = [];
			let minTemp = [];
			let maxWind = [];
			let minWind = [];
			let maxHumidity = [];
			let minHumidity = [];

			dates = Object.keys(dates).map(key => dates[key]);
				
			dates.map(day => {
				let maxTemperature = this.groupByMaxTemp(day);
				let minTemperature = this.groupByMinTemp(day);
				let wind = this.groupByWind(day);
				let humid = this.groupByHum(day);
				
				maxWind.push(Math.max(...wind));
				minWind.push(Math.min(...wind));
				maxHumidity.push(Math.max(...humid));
				minHumidity.push(Math.min(...humid));
				maxTemp.push(Math.max(...maxTemperature));
				minTemp.push(Math.min(...minTemperature));
			});

				this.setState({
					countryCode: res.city.country,
					temp: {
						max: maxTemp,
						min: minTemp
					},
					wind: {
						max: maxWind,
						min: minWind
					},
					humidity: {
						max: maxHumidity,
						min: minHumidity
					},
					interval: dates
				}, function() {
					console.log(this.state.interval);
				})
      })
    }
    render() {


        return(
          <div>
            { this.state.interval.map((interval, index) => {
              return (
							<div key={index} className="fiveDays">
								<h3>{interval[0].dt_txt.substring(0, 10)}</h3>
								<img src={`http://openweathermap.org/img/w/${interval[0].weather[0].icon}.png`} alt="weather-icon"/>
								<p>{interval[0].weather[0].description}</p>
								<p>Max temp: {this.renderTemperature(this.state.temp.max[index])} | Min temp: {this.renderTemperature(this.state.temp.min[index])}</p>
								<p>Max wind: {this.state.wind.max[index]} m/s | Min wind: {this.state.wind.min[index]} m/s</p>
								<p>Max humidity: {this.state.humidity.max[index]}% | Min humidity: {this.state.humidity.min[index]}%</p>
								<p></p>
							</div>
						)
						})}
          </div>
        )
    }
}

export default FiveDays;