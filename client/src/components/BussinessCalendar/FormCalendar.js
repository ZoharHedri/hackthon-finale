import React, { Component } from 'react';
import axios from 'axios';
import { inject, observer } from '../../../node_modules/mobx-react';


require('./BussinessCalendar.css');

// class WorkPetiod extends Component {

//     handleChange = event => {
//         this.props.store.setBussinessCalendar({ key: event.target.name, value: event.target.value })
//     }

//     render() {
//         return (
//             <div>
//                 <label>open your calendar from :
//             <input onChange={this.handleChange} name="name" type="text" placeholder="name" value={this.props.store.register.name} />
//                     <input type="date" /> to  <input type="date" />
//                 </label>
//             </div>
//         )

//     }
// }

// const WorkDays = props => (
//     <div>
//         <br /><label>your workdays: </label>
//         <div class="weekDays-selector">
//             <input type="checkbox" id="weekday-sun" class="weekday" />
//             <label for="weekday-sun">S</label>
//             <input type="checkbox" id="weekday-mon" class="weekday" />
//             <label for="weekday-mon">M</label>
//             <input type="checkbox" id="weekday-tue" class="weekday" />
//             <label for="weekday-tue">T</label>
//             <input type="checkbox" id="weekday-wed" class="weekday" />
//             <label for="weekday-wed">W</label>
//             <input type="checkbox" id="weekday-thu" class="weekday" />
//             <label for="weekday-thu">T</label>
//             <input type="checkbox" id="weekday-fri" class="weekday" />
//             <label for="weekday-fri">F</label>
//             <input type="checkbox" id="weekday-sat" class="weekday" />
//             <label for="weekday-sat">S</label>

//         </div>
//     </div>
// );
// const WorkHours = props => (
//     <div>
//         <label>work hours from:  <input type="time" /> to  <input type="time" /> </label>
//         <label>break from:  <input type="time" /> to  <input type="time" /> </label>
//     </div>
// );


@inject('store')
@observer
class FormCalendar extends Component {

    handleChange = event => {
        
        this.props.store.setBussinessCalendar({ key: event.target.name, value: event.target.value });
        // this.props.store.setBussinessCalendar();

    }

    render() {
        return (
            <div>
                <div>
                    <label>open your calendar from :
            <input onChange={this.handleChange} name="startPeriod" type="date" placeholder="date" value={this.props.store.bussinessCalendar.startPeriod} />
            {/* <input onChange={this.handleChange} name="startPeriod" type="date" placeholder="date" /> */}
             
                         to 
                         <input onChange={this.handleChange} name="endPeriod" type="date" placeholder="date" value={this.props.store.bussinessCalendar.endPeriod} />
                    </label>
                </div>
                <div>
                    <br /><label>your workdays: </label>
                    <div class="weekDays-selector">
                        <input type="checkbox" id="weekday-sun" class="weekday" />
                        <label for="weekday-sun">S</label>
                        <input type="checkbox" id="weekday-mon" class="weekday" />
                        <label for="weekday-mon">M</label>
                        <input type="checkbox" id="weekday-tue" class="weekday" />
                        <label for="weekday-tue">T</label>
                        <input type="checkbox" id="weekday-wed" class="weekday" />
                        <label for="weekday-wed">W</label>
                        <input type="checkbox" id="weekday-thu" class="weekday" />
                        <label for="weekday-thu">T</label>
                        <input type="checkbox" id="weekday-fri" class="weekday" />
                        <label for="weekday-fri">F</label>
                        <input type="checkbox" id="weekday-sat" class="weekday" />
                        <label for="weekday-sat">S</label>

                    </div>
                </div>
                <div>
                    <label>work hours from:  <input type="time" /> to  <input type="time" /> </label>
                    <label>break from:  <input type="time" /> to  <input type="time" /> </label>
                </div>
            </div >
        )
    }
}

export default FormCalendar;