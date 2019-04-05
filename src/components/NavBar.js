import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate } from 'react-day-picker/moment';

class NavBar extends Component {

  render() {
    const { view, onOverviewClick, setClass, flightCode, flightClass, date, onFlightChange, searchQuery, handleDayChange, } = this.props
    return (
      <nav className="navbar navbar-expand static-top row" style={{backgroundColor: '#fff', paddingBottom: '0px', height: '75px'}}>
        <div className="col-xs-auto">
          <img src="img/logo.png" style={{marginLeft: '15px'}} alt="SIA Logo"/>
        </div>

        <div className="col">
          <ul className="nav justify-content-center">
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              <li className="nav-item">
                <a className={`nav-link ${view === undefined ? 'active' : ''}`} id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected={view === undefined} onClick={onOverviewClick}>
                  Overview
                </a>
              </li>
              <li className="nav-item" style={{paddingLeft: '15px', width: '50vw'}}>
                <div className="search-bar-bg row no-gutters align-items-center" style={{ width: '100%'}}>
                  <div className="col-auto search-transparent">
                    <i className="fas fa-search "></i>
                  </div>
                  
                  <div className="col search-transparent">
                    <input className="form-control form-control-borderless search-transparent" id="datepicker" type="text" placeholder="Flight code" value={flightCode} onChange={onFlightChange} />
                  </div>
                  
                  <div className="col-auto search-transparent">
                    <i className="glyphicon fas fa-calendar"></i>&nbsp;&nbsp;
                    <DayPickerInput
                      formatDate={(d, _, l) => formatDate(d, "YYYY[-]MM[-]DD", l)}
                      value={date}
                      placeholder='YYYY-MM-DD'
                      onDayChange={handleDayChange}
                      dayPickerProps={{
                        selectedDays: date,
                      }}
                      style={{ marginRight: '16px' }}
                    />
                    <label className="radio-inline"><input type="radio" name="economy" onChange={setClass} checked={flightClass === 'economy'} style={{ marginLeft: '4px', marginRight: '4px' }}/>
                      Y
                    </label>&nbsp;
                    <label className="radio-inline"><input type="radio" name="business" onChange={setClass} checked={flightClass === 'business'} style={{ marginLeft: '4px', marginRight: '4px' }} />J</label>
                    <button className="btn btn-sm btn-success" type="submit" onClick={searchQuery}
                      style={{ marginLeft: '16px' }}
                      disabled={flightCode.trim() === '' || flightClass.trim() === '' || !date}
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