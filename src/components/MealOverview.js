import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

class MealOverview extends Component {

  constructor(props) {
    super(props)
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
    pieLabels: [],
    pieDatasets: [],
  }

  async componentDidMount() {
    const { view: meal, flight: { flightCode, flightClass, date } } = this.props
    const { mealCode } = meal

    const url = `https://ow4i80xiv1.execute-api.eu-west-2.amazonaws.com/beta/dashboard/meals/waste?mealCode=${mealCode}&flightCode=${flightCode}&date=${date}&flightClass=${flightClass}`
    console.log(url)

    const { data } = await axios.get(url) 
    const foodWaste = data.map(item => item.foodItems)
    console.log(foodWaste)
    
    this.updateFoodWaste(foodWaste)
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

    this.setState({ rows, labels, datasets })
  }

  render() {
    const { view: meal } = this.props
    const { mealCode, mealName } = meal
    return (
      <>
        <ol className="breadcrumb" style={{ backgroundColor: 'transparent' }}>
          <div className="breadcrumb-item active" style={{ fontSize: '20px', color: '#4F4F4F', paddingTop: '20px' }}>
            > {mealCode.toUpperCase()} - {mealName}
          </div>
        </ol>

        <div className="row">
          <div className="col-xl-7 col-xs-12">
            <div className="card ">
              <div className="card-header">
                <i className="fas fa-chart-area"></i>
                &nbsp;&nbsp;Breakdown
              </div>
              <div className="card-body">
                <Pie data={{
                  labels: this.state.labels,
                  datasets: this.state.datasets
                }} />
              </div>
              <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
            </div>
          </div>

          <div className="col-xl-5 col-xs-12">
            <div className="card ">
              <div className="card-header">
                <i className="fas fa-table"></i>
                &nbsp;&nbsp;List
              </div>
              <div className="card-body">
                <MDBDataTable 
                  striped
                  bordered
                  hover
                  data={{
                    columns: this.state.columns,
                    rows: this.state.rows
                  }}
                />
              </div>
              <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default MealOverview;