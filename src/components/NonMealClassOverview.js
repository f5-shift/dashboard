import React, { Component } from 'react';
import axios from 'axios'
import FoodOverview from './FoodOverview';

const capitalise = words => words.split(' ').map(word => word.split('').map((x, i) => i === 0 ? x.toUpperCase() : x).join('')).join(' ')

class NonMealClassOverview extends Component {

  constructor(props) {
    super(props)
    this.updateFoodWaste = this.updateFoodWaste.bind(this)
    this.refresh = this.refresh.bind(this)
  }

  state = {
    loading: false,
    labels: [],
    datasets: [],
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
    rows: []
  }

  async refresh() {
    const { view: { flightCode, flightClass, date } } = this.props

    const { data } = await axios.get(`https://ow4i80xiv1.execute-api.eu-west-2.amazonaws.com/beta/dashboard/meals/waste?flightCode=${flightCode}&flightClass=${flightClass}&date=${date}`)
    const foodWaste = data.map(item => item.foodItems)
    
    const payload = this.updateFoodWaste(foodWaste)
    this.setState({ lastUpdated: new Date(), ...payload })
  }

  async componentDidMount() {
    await this.refresh()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.view !== this.props.view) await this.refresh()
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
    const { view } = this.props
    const { flightCode, flightClass, from, to, date } = view
    const { loading } = this.state
    return (
      <div id="content-wrapper">
        {loading && <div></div>}
        {
          !loading && 
          <div className="container-fluid" style={{ paddingRight: '25px', paddingLeft: '25px'}}>
            <ol className="breadcrumb" style={{backgroundColor: 'transparent'}}>
              <div className="breadcrumb-item active" style={{fontSize: '20px', color: '#4F4F4F', paddingTop: '20px'}}>
                <i className="fas fa-chevron-right"></i>&nbsp;&nbsp;
                {flightCode} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {from} <i className="fas fa-fighter-jet" style={{color: '#F5A623'}}></i> {to} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {capitalise(flightClass)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {date} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <i className="fas fa-sync" onClick={this.refresh}></i>
              </div>
            </ol>

            <FoodOverview {...this.state} />
          </div>
        }
      </div>
    )
  }
}

export default NonMealClassOverview;