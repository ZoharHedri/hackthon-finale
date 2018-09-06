import React, { Component, Children } from 'react';
import { inject, observer } from '../../../node_modules/mobx-react';

import FormCalendar from './FormCalendar';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
// import dates from '../../utils/dates';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BussinessCalendar.css';



// let eventsList = [];
let allViews = Object.keys(BigCalendar.Views).map(k => k !== "agenda" ? BigCalendar.Views[k] : null)

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const handleSelect = ({ start, end }) => {
  // debugger;
  alert("fdjhtd");
}

@inject("store")
@observer
class ColoredDateCellWrapper extends Component {
  START_PERIOD = moment(this.props.store.bussinessCalendar.startPeriod).toDate();
  END_PERIOD = moment(this.props.store.bussinessCalendar.endPeriod).toDate();
  render() {
    return React.cloneElement(Children.only(this.props.children), {
      style: {
        ...this.props.children.style,
        backgroundColor: this.props.value >= this.START_PERIOD && this.props.value <= this.END_PERIOD ? 'lightgreen' : '#fff',
      },
    });
  }
}

@observer
class Calendar extends Component {
  eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor;
    let fontWeight;
    let date = moment(start).format("DD/MM/YYYY");
    let now = moment().format("DD/MM/YYYY");
    if (date === now) {
      backgroundColor = '#f1c40f';
      fontWeight = 700;
    }
    else {
      backgroundColor = '#2ecc71';
    }
    let style = {
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      fontWeight: fontWeight || 400,
      opacity: 0.8,
      color: '#fff',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  }
  render() {
    return <div className="calanderConteiner">
      <BigCalendar
        events={this.props.events}
        defaultView={BigCalendar.Views.MONTH}
        views={allViews}
        selectable
        eventPropGetter={this.eventStyleGetter}
        components={{
          dateCellWrapper: ColoredDateCellWrapper
        }}
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
  }
}

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