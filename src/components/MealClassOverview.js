import React, { Component } from 'react';
import MealOverview from './MealOverview'
import axios from 'axios';
import FoodOverview from './FoodOverview';

const capitalise = words => words.split(' ').map(word => word.split('').map((x, i) => i === 0 ? x.toUpperCase() : x).join('')).join(' ')


class MealClassOverview extends Component {

  constructor(props) {
    super(props)
    this.onSelectedMeal = this.onSelectedMeal.bind(this)
    this.onClearSelectedMeal = this.onClearSelectedMeal.bind(this)
    this.refresh = this.refresh.bind(this)
    this.updateFoodWaste = this.updateFoodWaste.bind(this)
  }

  images = [
    'fish.png', 'steak.png', 'broccoli.png'
  ]

  state = {
    loading: false,
    meals: [],
    selectedMeal: undefined,
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

  async refresh() {
    const { view: { flightCode, flightClass, date } } = this.props

    // Get list of meals
    const { data: meals } = await axios.get(`https://ow4i80xiv1.execute-api.eu-west-2.amazonaws.com/beta/dashboard/meals?flightCode=${flightCode}&flightClass=${flightClass}&date=${date}`)
    
    // Get aggregate data
    const { data } = await axios.get(`https://ow4i80xiv1.execute-api.eu-west-2.amazonaws.com/beta/dashboard/meals/waste?flightCode=${flightCode}&flightClass=${flightClass}&date=${date}`)
    const foodWaste = data.map(item => item.foodItems)
    
    const payload = this.updateFoodWaste(foodWaste)

    this.setState({ meals, selectedMeal: undefined, lastUpdated: new Date(), ...payload })
  }

  async componentDidMount() {
    await this.refresh()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.view !== this.props.view) await this.refresh()
  }

  onSelectedMeal = selectedMeal => event => this.setState({ selectedMeal })

  onClearSelectedMeal = event => this.setState({ selectedMeal: undefined })

  render() {
    const { view } = this.props
    const { flightCode, flightClass, from, to, date } = view
    const { meals, selectedMeal, loading } = this.state
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
                {date}
              </div>
            </ol>

            <div className="row">
              <div className="col-xl-3 col-sm-6 mb-3">
                <div className={`card o-hidden h-100 ${!selectedMeal ? 'card-selected' : ''}`} style={{backgroundColor: '#fff', border: 'none', boxShadow: '3px 3px 11px 0px rgba(222,222,222,1)'}}
                  onClick={this.onClearSelectedMeal}
                >
                  <div className="card-body">
                    <div className="card-body-icon" style={{opacity: 100}}>
                      
                    </div>
                    <h3 className="mr-5">Overview</h3>
                  </div>
                </div>
              </div>
              {
                meals.map((meal, idx) => (
                  <div key={idx} className="col-xl-3 col-sm-6 mb-3">
                    <div className={`card o-hidden h-100 ${selectedMeal === meal ? 'card-selected' : ''}`} style={{backgroundColor: '#fff', border: 'none', boxShadow: '3px 3px 11px 0px rgba(222,222,222,1)'}}
                      onClick={this.onSelectedMeal(meal) }
                    >
                      <div className="card-body">
                        <div className="card-body-icon" style={{opacity: 100}}>
                          <img src={`/img/${this.images[idx % this.images.length]}`} alt=""/>
                        </div>
                        <h3 className="mr-5">{meal.mealCode.toUpperCase()}</h3>
                        <p>{meal.date} to {meal.endDate}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            <hr />
            {
              !selectedMeal && 
              <>
              <ol className="breadcrumb" style={{ backgroundColor: 'transparent' }}>
                <div className="breadcrumb-item active" style={{ fontSize: '20px', color: '#4F4F4F', paddingTop: '20px' }}>
                  <i className="fas fa-chevron-right"></i>&nbsp;&nbsp;Overview - All Meals&nbsp;&nbsp;
                  <i className="fas fa-sync" onClick={this.refresh}></i>
                </div>
              </ol>
              <FoodOverview {...this.state} />
              </>
            }
            {
              selectedMeal && <MealOverview flight={view} view={selectedMeal}  />
            }
          </div>
        }
      </div>
    )
  }
}

export default MealClassOverview;