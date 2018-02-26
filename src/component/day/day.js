import React, {Component} from 'react';

class Day extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: {
        temp: [],
        max: [],
        min: [],        
      },
      isCelsius: true
    }
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      isCelsius: nextProps.isCelsius
    })
  }

  getTemperature = (temp) => {
    return (
      this.state.isCelsius === true
        ? temp
        : ((temp * 9 / 5) + 32).toFixed(2)
    )
    
  }

  renderTemperature = (temp) => {
    return (
      this.state.isCelsius === true
        ? `${this.getTemperature(temp)} °C`
        : `${this.getTemperature(temp)} °F`
    );
  }
  // switch() {
	// 	this.state.unit === 'C' ?
	// 	this.setState({
	// 			unit: 'F'
	// 	}, function() {
  //     console.log(this.state.unit);
  //   }) :
	// 	this.setState({
	// 			unit: 'C'
	// 	}, function() {
  //     console.log(this.state.unit);
  //   })

		// this.setState(prevState => ({
		// 		isCelsius: !prevState.isCelsius
		// 	}), function() {
		// 		this.state.isCelsius ?
		// 		(
		// 			this.toFahrenheit(this.state.climate.temp)
		// 			// this.toFahrenheit(this.state.forecast)
		// 		)
		// 		:
		// 		(
		// 			this.toCelsius(this.state.climate.temp)
		// 			// this.toCelsius(this.state.forecast)
		// 		)
		// 	});
  // }
  
    render() {
        return(
          <div className="holder">
            <div className="row">
              <div className="small-10 small-centered column">
                <div className="forecast-container">
                  <h4>{this.props.interval.dt_txt}</h4>
                  <div className="row collapse">
                    <div className="small-2 medium-3 column weather-icon">
                    <img src={`http://openweathermap.org/img/w/${this.props.interval.weather[0].icon}.png`} alt="Weather icon" />
                    </div>
                    <div className="small-10 medium-9 column">
                      { this.renderTemperature(this.props.interval.main.temp) }
                      <br />
                      Highest {this.renderTemperature(this.props.interval.main.temp_max)}
                      <br />
                      Lowest {this.renderTemperature(this.props.interval.main.temp_min)}
                      <br />
                      {this.props.interval.weather[0].description}
                      <br />
                      Wind speed {this.props.interval.wind.speed} m/s
                      <br />
                      Humidity {this.props.interval.main.humidity} %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>     
        )
    }
}

export default Day;