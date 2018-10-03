import React, { Component, Children } from 'react';
import { inject, observer } from '../../../node_modules/mobx-react';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BussinessCalendar.scss';
import SetDay from './SetDay';
import { Modal, Button } from '@material-ui/core';



// let eventsList = [];
let allViews = Object.keys(BigCalendar.Views).map(k => k !== "agenda" ? BigCalendar.Views[k] : null)

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer


// #FFD400 #34E555 #0493F9
@inject("store")
@observer
class ColoredDateCellWrapper extends Component {
  START_PERIOD = moment().startOf('month').toDate();
  END_PERIOD = moment().endOf('month').toDate();
  render() {
    let value = moment(this.props.value).format("DD/MM/YYYY");
    let found = this.props.store.monthDays.find(day => {
      return day.date === value
    });
    return React.cloneElement(Children.only(this.props.children), {
      style: {
        ...this.props.children.style,
        backgroundColor: found ? "#0493F9" : this.props.value >= this.START_PERIOD && this.props.value <= this.END_PERIOD ? '#f5f5f5' : '#fff',
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
        <Button variant="flat" color="secondary" onClick={goToCurrent}>today</Button>

      </div>
      <label className={'label-date'}>{label()}</label>
      <div className="btn-view-group">
        <Button variant="flat" color="primary" type="button" onClick={() => toolbar.onViewChange('month')}>Month</Button>
        <Button variant="flat" color="primary" type="button" onClick={() => toolbar.onViewChange('week')}>Week</Button>
        <Button variant="flat" color="primary" type="button" onClick={() => toolbar.onViewChange('day')}>Day</Button>
        <Button variant="flat" color="primary" type="button" onClick={() => toolbar.onViewChange('agenda')}>Agenda</Button>
      </div>
    </div >
  );
}

class EventStyle extends Component {
  render() {
    let start = moment(this.props.event.start).format("hh:mm");
    let end = moment(this.props.event.end).format("hh:mm");
    return <div className="eventStyle">
      <div className="eventStyle__title">{this.props.title}</div>
      <div className="eventStyle__time">{start} - {end}</div>
    </div>
  }
}

@inject("store")
@observer
class Calendar extends Component {
  eventStyleGetter = (event, start, end, isSelected) => {
    let style = ({
      backgroundColor: 'transparent',
      border: 'none',
      display: 'block'
    });
    return {
      style: style
    };
  }
  handleSelect = (e) => {
    let today = moment();
    let date = moment(e.start);
    if (date < today) return;
    this.props.store.date = date.format("DD/MM/YYYY");
    this.props.store.openModalDay = true;
  }
  handleClose = () => {
    this.props.store.openModalDay = false;
  }
  render() {
    return <div className="calanderConteiner">
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.store.openModalDay}
        onClose={this.handleClose}>
        <SetDay />
      </Modal>
      <BigCalendar
        events={this.props.events}
        defaultView={BigCalendar.Views.MONTH}
        views={allViews}
        selectable
        eventPropGetter={this.eventStyleGetter}
        components={{
          dateCellWrapper: ColoredDateCellWrapper,
          toolbar: CustomToolbar,
          event: EventStyle
        }}
        // onSelectEvent={event => alert(event.title)}
        onSelectSlot={this.handleSelect}
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
        <Calendar startPeriod={this.props.store.bussinessCalendar.startPeriod}
          events={this.props.store.events}
        />
      </div >
    )
  }
}

export default BussinessCalendar;