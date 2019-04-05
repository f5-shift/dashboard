import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    const { view, onOverviewClick, setClass, flightCode, flightClass, onFlightChange, searchQuery } = this.props
    return (
      <nav className="navbar navbar-expand static-top row" style={{backgroundColor: '#fff', paddingBottom: '0px', height: '75px'}}>
        <div className="col-md-3">
          <img src="img/logo.png" style={{marginLeft: '15px'}} />
        </div>

        <div className="col-md-6">
          <ul className="nav justify-content-center">
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              <li className="nav-item">
                <a className={`nav-link ${view === undefined ? 'active' : ''}`} id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected={view === undefined} onClick={onOverviewClick}>
                  Overview
                </a>
              </li>
              <li className="nav-item" style={{paddingLeft: '15px'}}>
                <div className="search-bar-bg row no-gutters align-items-center">
                  <div className="col-auto search-transparent">
                    <i className="fas fa-search "></i>
                  </div>
                  
                  <div className="col search-transparent">
                    <input className="form-control form-control-borderless search-transparent" id="datepicker" type="text" placeholder="Search topics or keywords" value={flightCode} onChange={onFlightChange} />
                  </div>
                  
                  <div className="col-auto search-transparent">
                    <i className="glyphicon fas fa-calendar"></i>&nbsp;&nbsp;
                    <label className="radio-inline"><input type="radio" name="economy" onChange={setClass} checked={flightClass === 'economy'} />
                      Y
                    </label>&nbsp;
                    <label className="radio-inline"><input type="radio" name="business" onChange={setClass} checked={flightClass === 'business'} />J</label>
                    <button className="btn btn-sm btn-success" type="submit" onClick={searchQuery}
                      disabled={flightCode.trim() === '' || flightClass.trim() === ''}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;