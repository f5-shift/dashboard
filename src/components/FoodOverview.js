import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import { MDBDataTable } from 'mdbreact';

class FoodOverview extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-xl-7 col-xs-12">
          <div className="card ">
            <div className="card-header">
              <i className="fas fa-chart-area"></i>
              &nbsp;&nbsp;Breakdown
            </div>
            <div className="card-body">
              <Pie data={{
                labels: this.props.labels,
                datasets: this.props.datasets
              }} />
            </div>
            { this.props.lastUpdated &&
              <div className="card-footer small text-muted">Updated {this.props.lastUpdated.toString()}</div>
            }
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
                  columns: this.props.columns,
                  rows: this.props.rows
                }}
              />
            </div>
            { this.props.lastUpdated &&
              <div className="card-footer small text-muted">Updated {this.props.lastUpdated.toString()}</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default FoodOverview;