import React, { Component } from 'react';
import { inject, observer } from '../../../node_modules/mobx-react';

import FormCalendar from './FormCalendar';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
// import dates from '../../utils/dates';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BussinessCalendar.css';



// let eventsList = [];

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const handleSelect = ({ start, end }) => {
  // debugger;
  alert("fdjhtd");
}

const Calendar = props => (
  <div className="calanderConteiner">
    <BigCalendar
      events={props.events}
      defaultView={BigCalendar.Views.WEEK}
      views={allViews}
      selectable
      onSelectEvent={event => alert(event.title)}
      onSelectSlot={handleSelect}
      scrollToTime={new Date(2018, 7, 1, 6)}
      step={15}
      timeslots={1}
    // min={new Date(2018, 8, 1)}
    // max={new Date(2018, 9, 1)}
    //  defaultDate={Date.now}
    // startAccessor={props.startPeriod}
    // endAccessor='endDate'
    />
  </div>
);

@inject('store')
@observer
class BussinessCalendar extends Component {
  componentDidMount() {
    this.props.store._getBussinessEvents();
  }
  render() {
    return (
      <div>
        <FormCalendar />
        <Calendar startPeriod={this.props.store.bussinessCalendar.startPeriod}
          events={this.props.store.events}
        />
      </div >
    )
  }
}

export default BussinessCalendar;