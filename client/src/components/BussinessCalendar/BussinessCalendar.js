import React, { Component, Children } from 'react';
import { inject, observer } from '../../../node_modules/mobx-react';

import FormCalendar from './FormCalendar';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

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
    let found = this.props.store.monthDays.find(day => moment(day.date, "DD/MM/YYYY").toDate() === this.props.value);
    return React.cloneElement(Children.only(this.props.children), {
      style: {
        ...this.props.children.style,
        backgroundColor: found ? "red" : this.props.value >= this.START_PERIOD && this.props.value <= this.END_PERIOD ? '#f5f5f5' : '#fff',
      },
    });
  }
}

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate('prev');
  };

  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate('next');
  };

  const goToCurrent = () => {
    const now = new Date();
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setYear(now.getFullYear());
    toolbar.onNavigate('current');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div onClick={goToBack} style={{ cursor: 'pointer', width: '1.25rem', height: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ width: '100%', height: '100%', fill: '#333' }}>
            <use xlinkHref="/sprites/solid.svg#chevron-left" />
          </svg>
        </div>
        <div onClick={goToNext} style={{ cursor: 'pointer', width: '1.25rem', height: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ width: '100%', height: '100%', fill: '#333' }}>
            <use xlinkHref="/sprites/solid.svg#chevron-right" />
          </svg>
        </div>
        <button style={{ cursor: 'pointer', background: "#eee", border: 'none', margin: '0 16px', padding: '5px 15px', borderRadius: '5px' }} onClick={goToCurrent}>today</button>

      </div>
      <label className={'label-date'}>{label()}</label>
    </div >
  );
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
    let style = ({
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      fontWeight: fontWeight || 400,
      opacity: 0.8,
      color: '#fff',
      border: '0px',
      display: 'block',
      position: 'relative',
      '&::before': {
        content: `""`,
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '3px',
        height: '100%',
        background: "#f00"
      }
    });
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
          dateCellWrapper: ColoredDateCellWrapper,
          toolbar: CustomToolbar
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
    this.props.store._getBussinessMonthDays();
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