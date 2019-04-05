import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { formatDate } from 'react-day-picker/moment';
import axios from 'axios';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

class Overview extends Component {

  constructor(props) {
    super(props)
    this.refresh = this.refresh.bind(this)
  }

  state = {}

  async refresh() {
    const formattedDate = formatDate(new Date(), 'YYYY[-]MM[-]DD', 'en')
    const { data } = await axios.get(`https://ow4i80xiv1.execute-api.eu-west-2.amazonaws.com/beta/waste?endDate=${formattedDate}`)
    console.log(data)
  }

  async componentDidMount() {
    await this.refresh()
  }

  render() {
    return (
      <div id="content-wrapper">
        <div className="container-fluid">
          <ol className="breadcrumb" style={{backgroundColor: 'transparent'}}>
            <div className="breadcrumb-item active" style={{fontSize: '20px', color: '#4F4F4F', paddingTop: '20px'}}>
              <i className="fas fa-chevron-right"></i>&nbsp;&nbsp;
              Overview&nbsp;&nbsp;
              <i className="fas fa-sync" onClick={this.refresh}></i>
            </div>
          </ol>
          <div className="card mb-3">
            <div className="card-header">
              <i className="fas fa-tools"></i>
              Other Tools
            </div>
            <div className="card-body">
              <a rel="noopener noreferrer" href="http://f5shift-admin-panel.s3-website.eu-west-2.amazonaws.com" target="_blank"><button type="button" className="btn btn-primary">Admin Panel - tagging tool, uplift plan management</button></a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a rel="noopener noreferrer" href="http://f5shift-remotes.s3-website.eu-west-2.amazonaws.com" target="_blank"><button type="button" className="btn btn-primary">Remote for Food Capturing Devices</button></a>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-3">
                <div className="card-header">
                  <i className="fas fa-chart-bar"></i>
                  Wastage per day <span className="badge badge-danger">TODO not linked</span>
                </div>
                <div className="card-body">
                  <Line data={data} />
                </div>
                <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card mb-3">
                <div className="card-header">
                  <i className="fas fa-chart-pie"></i>
                  What was wasted the most <span className="badge badge-danger">TODO not linked</span>
                </div>
                <div className="card-body">
                  
                </div>
                <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Overview;