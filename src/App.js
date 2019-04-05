import React, { Component } from 'react';
import NavBar from './components/NavBar';
import Overview from './components/Overview';
import MealClassOverview from './components/MealClassOverview';
import NonMealClassOverview from './components/NonMealClassOverview';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props)
    this.onOverviewClick = this.onOverviewClick.bind(this)
    this.setClass = this.setClass.bind(this)
    this.onFlightChange = this.onFlightChange.bind(this)
    this.searchQuery = this.searchQuery.bind(this)
  }

  state = {
    flightCode: '',
    flightClass: '',
    date: '2019-01-01',
    // childView: {
    //   flightCode: 'SQ856',
    //   from: 'SIN',
    //   to: 'HKG',
    //   date: '2019-04-04',
    //   flightClass: 'economy',
    //   hasMeal: true
    // },
    childView: undefined
  }

  onFlightChange = event => this.setState({ flightCode: event.target.value })

  onOverviewClick = event => this.setState({ childView: undefined })
  
  setClass = event => this.setState({ flightClass: event.target.name })

  searchQuery = async event => {
    const { flightCode, flightClass, date } = this.state
    
    const { data } = await axios.get(`https://ow4i80xiv1.execute-api.eu-west-2.amazonaws.com/beta/dashboard?flightCode=${flightCode}&flightClass=${flightClass}&date=${date}`)
    if (!data) {
      alert('Nothing found')
      this.setState({ childView: undefined })
      return
    }

    this.setState({ childView: data })
  }

  render() {
    const { childView, flightClass, flightCode, date } = this.state
    return (
      <>
      <NavBar view={childView} 
        onOverviewClick={this.onOverviewClick} 
        onFlightChange={this.onFlightChange}
        setClass={this.setClass}
        flightClass={flightClass}
        flightCode={flightCode}
        date={date}
        searchQuery={this.searchQuery}
      />
      {
        !childView && <Overview /> 
      }
      {
        childView && childView.hasMeal && <MealClassOverview view={childView} />
      }
      {
        childView && !childView.hasMeal && <NonMealClassOverview view={childView} />
      }
      </>
    );
  }
}

export default App;