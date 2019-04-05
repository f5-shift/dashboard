import React, { Component } from 'react';
import axios from 'axios';
import FoodOverview from './FoodOverview';

class MealOverview extends Component {

  constructor(props) {
    super(props)
    this.refresh = this.refresh.bind(this)
    this.updateFoodWaste = this.updateFoodWaste.bind(this)
  }

  state = {
    columns: [
      {
        label: 'Ingredient',
        field: 'name',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Waste',
        field: 'area',
        sort: 'asc',
        width: 150
      },
    ],
    rows: [],
    labels: [],
    datasets: [],
  }

  async refresh() {
    const { view: meal, flight: { flightCode, flightClass, date } } = this.props
    const { mealCode } = meal

    const url = `https://ow4i80xiv1.execute-api.eu-west-2.amazonaws.com/beta/dashboard/meals/waste?mealCode=${mealCode}&flightCode=${flightCode}&date=${date}&flightClass=${flightClass}`
    console.log(url)

    const { data } = await axios.get(url) 
    const foodWaste = data.map(item => item.foodItems)
    console.log(foodWaste)
    
    const payload = this.updateFoodWaste(foodWaste)
    this.setState({ lastUpdated: new Date(), ...payload })
  }

  async componentDidMount() {
    await this.refresh() 
  }

  updateFoodWaste(foodWaste) {
    const totalWaste = {}
    let totalArea = 0
    for (const waste of foodWaste) {
      for (const [name, { area }] of Object.entries(waste)) {
        if (!(name in totalWaste)) totalWaste[name] = 0
        totalWaste[name] += area
        totalArea += area
      }
    }

    // Data table
    const rows = Object.entries(totalWaste).map(([name, area]) => ({ name, area }))
    
    // Pie chart
    const percentageWaste = Object.keys(totalWaste).reduce((obj, key) => {
      obj[key] = totalWaste[key] / totalArea
      return obj
    }, {})
    const relatives = Object.entries(percentageWaste).map(([name, percentage]) => ({ name, percentage }))
    const labels = relatives.map(relative => relative.name)
    const data = relatives.map(relative => relative.percentage)

    const datasets = [
      {
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }
    ]

    return { rows, labels, datasets }
  }

  render() {
    const { view: meal } = this.props
    const { mealCode, mealName } = meal
    return (
      <>
        <ol className="breadcrumb" style={{ backgroundColor: 'transparent' }}>
          <div className="breadcrumb-item active" style={{ fontSize: '20px', color: '#4F4F4F', paddingTop: '20px' }}>
            <i className="fas fa-chevron-right"></i>&nbsp;&nbsp;{mealCode.toUpperCase()} - {mealName} &nbsp;&nbsp;
            <i className="fas fa-sync" onClick={this.refresh}></i>
          </div>
        </ol>

        <FoodOverview {...this.state} />
      </>
    );
  }
}

export default MealOverview;