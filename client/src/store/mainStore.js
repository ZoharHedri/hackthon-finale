import { observable, action, computed } from 'mobx';
import axios from 'axios';

// TODO: here we will handle all of our states
class Store {
    @observable errors = [];

    @observable activities = [];

    @observable registerBussinessForm = {
        name: "",
        phone: "",
        category: "",
        email: "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
        address: ""
    }

    @observable activityForm = {
        type: "",
        price: "",
        duration: ""
    }

    @action setActivityForm = (obj)=>{
        this.activityForm[obj.key] = obj.value;
    }

    @action addActivity = ()=>{
        let token = localStorage.getItem('TOKEN');
        let options = {};
        options.headers = { "Authorization": token };
        let activits = this.activityForm;
        axios.post('/activities/addActivity', activits, options)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => { console.log(err) })
    }
 
    @observable loginForm = {
        email: "",
        password: ""
    }


    @observable registerClientForm = {
        name: "",
        phone: "",
        email: "",
        password: ""
    }

    @observable forgotPasswordForm = {
        email: ""
    }

    @observable resetPasswordForm = {
        password: "",
        passwordConfirm: ""
    }

    @observable userStatus = {
        loggedIn: false,
        userModel: ""
    }

    @computed get getSetting() {
        return this.registerBussinessForm;
    }

    @action getSettingApi = () => {
        let token = localStorage.getItem("TOKEN");
        let opts = {};
        opts.headers = { Authorization: token };
        axios.get('/bussiness/setting', opts)
            .then(res => {
                this.registerBussinessForm = res.data.info;
            })
            .catch(err => console.log(err));
    }

    @action _setErrors = (errors) => {
        debugger;
        this.errors = errors;
    }



    @action automaticLogin = () => {
        let token = localStorage.getItem("TOKEN");
        if (token) {
            let opts = {};
            opts.headers = { Authorization: token };
            let current = this;
            axios.get('/users/automaticLogin', opts)
                .then(res => {
                    if (res.data.success) {
                        let user = {
                            loggedIn: true,
                            userModel: res.data.user + "/dashboard"
                        }
                        current.userStatus = user;
                    }
                })
                .catch(err => {
                    current.userStatus.loggedIn = false;
                    console.log(err);
                });
        }
    }


    @action setResetPasswordForm = (obj) => {
        this.resetPasswordForm[obj.key] = obj.value;
    }

    @action setForgotPasswordForm = (obj) => {
        this.forgotPasswordForm[obj.key] = obj.value;
    }

    @observable clients = [];

    @observable message = null;

    @observable business = [];

    @action isExists = (user) => {
        if (user === "bussiness") {
            if (this.registerBussinessForm.email === "") {
                this.message = null;
                return;
            }
            axios.post('/bussiness/isExists', { email: this.registerBussinessForm.email })
                .then(res => {
                    this.message = res.data.msg;
                })
                .catch(err => console.log(err.msg));
        } else if (user === "client") {
            if (this.registerClientForm.email === "") {
                this.message = null;
                return;
            }
            axios.post('/clients/isExists', { email: this.registerClientForm.email })
                .then(res => {
                    this.message = res.data.msg;
                })
                .catch(err => console.log(err.msg));
        }
    }

    @action setRegisterBussinessForm = (obj) => {
        this.registerBussinessForm[obj.key] = obj.value;
    }

    @action setLoginForm = (obj) => {
        this.loginForm[obj.key] = obj.value;
    }

    // register to database
    @action registerBussiness = () => {
        axios.post('/bussiness/register', this.registerBussinessForm)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data)
                } else {
                    this.errors = res.data.errors;
                }
            })
            .catch(err => console.log(err.msg));
    }

    @action registerClient = () => {
        axios.post('/clients/register', this.registerClientForm)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data)
                } else {
                    this.errors = res.data.errors;
                }
            })
            .catch(err => console.log(err.msg));
    }

    //login to a database using email - BUSSINESS or CLIENT return
    @action login = () => {
        axios.post('/users/login', this.loginForm)
            .then(res => {
                if (res.data.success) {
                    // we saved the token from the server in localstorage
                    localStorage.setItem('TOKEN', res.data.token);
                    let user = {
                        loggedIn: true,
                        userModel: res.data.user + "/dashboard"
                    }
                    this.userStatus = user;
                    this._clearErrors();
                } else {
                    this.loggedIn = false;
                    this._addError(res.data.msg);
                }
            })
            .catch(err => this._addError(err.msg));
    }


    @action setRegisterClientForm = (obj) => {
        this.registerClientForm[obj.key] = obj.value;
    }

    @action getClients() {
        let token = localStorage.getItem('TOKEN');
        let opts = {}
        opts.headers = { Authorization: token }
        //go to '/bussiness' -> Router.get('/clients'...)
        axios.get('/bussiness/clients', opts)
            .then(res => {
                this.clients = res.data.clients;
                this._clearErrors();
            })
            .catch(err => {
                this._addError(err.msg);
            });
    }

    @action logout = () => {
        let user = {
            loggedIn: false,
            userModel: ""
        }
        this.userStatus = user;
    }

    @action _clearMessage = () => {
        this.message = "";
    }

    @action forgot = () => {
        axios.post('/users/password/forgot', this.forgotPasswordForm)
            .then(res => {
                if (res.data.success) {
                    this._clearErrors();
                } else {
                    this._addError(res.data.msg);
                }
            })
            .catch(err => this.errors = err.response.data.errors);
    }

    @action resetPassword = (token) => {
        axios.post('/users/password/reset/' + token, { password: this.resetPasswordForm.password })
            .then(res => console.log(res.data))
            .catch(err => console.log(`${err}`));
    }

    @action getActivities = () => {
        let token = localStorage.getItem('TOKEN');
        let options = {};
        options.headers = { "Authorization": token };
        let current = this;
        axios.get('/activities', options)
            .then(res => {
                current.activities = res.data.activites
                console.log(res.data)
            })
            .catch(err => { console.log(err) })
    }

    _addError = (message) => {
        if (!this.errors.find(err => err === message)) {
            this.errors.push(message);
        }
    }
    _clearErrors = () => {
        this.errors.length = 0;
    }




    @observable bussinessCalendar = {
        startPeriod: Date,
        endPeriod: Date,
        workDays: [
            { day: "weekday-sun", flag: false, statrTime: '', endTime: '' },
            { day: "weekday-mon", flag: false, statrTime: '', endTime: '' },
            { day: "weekday-tue", flag: false, statrTime: '', endTime: '' },
            { day: "weekday-wed", flag: false, statrTime: '', endTime: '' },
            { day: "weekday-thu", flag: false, statrTime: '', endTime: '' },
            { day: "weekday-fri", flag: false, statrTime: '', endTime: '' },
            { day: "weekday-sat", flag: false, statrTime: '', endTime: '' },
        ]
    }

    @action setBussinessCalendar = (obj) => {
        this.bussinessCalendar[obj.key] = obj.value;

        console.log('setBussinessCalendar chaged..');
    }


    @action setBussinessCalendarDay = (dayName) => {
        let findDay = this.bussinessCalendar.workDays.find(item => dayName === item.day);
        findDay.flag = !findDay.flag;

    }


    @action setBussinessCalendarDayTime = (obj) => {
        // let findDay = this.bussinessCalendar.workDays.find(item => dayName === item.day);
        this.bussinessCalendar.workDays[0][obj.key] = obj.value;

        console.log('setBussinessCalendarDayTime chaged..');
    }



    @action setBussinessCalendarWorkDays = (periodWorkDays) => {

        let token = localStorage.getItem('TOKEN');
        let opts = {}
        opts.headers = { Authorization: token }
        axios.post('/bussiness/calendar/', periodWorkDays, opts)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.msg));
    }

    @observable events = this._getBussinessEvents();

    _getBussinessEvents() {
        let myEventsList = [
            {
                id: 0,
                title: 'All Day Event very long title',
                allDay: true,
                start: new Date(2018, 8, 0),
                end: new Date(2018, 8, 1),
            },
            {
                id: 5,
                title: 'Conference',
                start: new Date(2015, 3, 11),
                end: new Date(2015, 3, 13),
                desc: 'Big conference for important people',
            },
            {
                id: 6,
                title: 'Meeting',
                start: new Date(2015, 3, 12, 10, 30, 0, 0),
                end: new Date(2015, 3, 12, 12, 30, 0, 0),
                desc: 'Pre-meeting meeting, to prepare for the meeting',
            },
            {
                id: 7,
                title: 'Lunch',
                start: new Date(2015, 3, 12, 12, 0, 0, 0),
                end: new Date(2015, 3, 12, 13, 0, 0, 0),
                desc: 'Power lunch',
            },
            {
                id: 8,
                title: 'Meeting',
                start: new Date(2015, 3, 12, 14, 0, 0, 0),
                end: new Date(2015, 3, 12, 15, 0, 0, 0),
            },
            {
                id: 9,
                title: 'Happy Hour',
                start: new Date(2015, 3, 12, 17, 0, 0, 0),
                end: new Date(2015, 3, 12, 17, 30, 0, 0),
                desc: 'Most important meal of the day',
            },
            {
                id: 10,
                title: 'Dinner',
                start: new Date(2015, 3, 12, 20, 0, 0, 0),
                end: new Date(2015, 3, 12, 21, 0, 0, 0),
            },
            {
                id: 11,
                title: 'Birthday Party',
                start: new Date(2015, 3, 13, 7, 0, 0),
                end: new Date(2015, 3, 13, 10, 30, 0),
            },
            {
                id: 12,
                title: 'Late Night Event',
                start: new Date(2015, 3, 17, 19, 30, 0),
                end: new Date(2015, 3, 18, 2, 0, 0),
            },
            {
                id: 12.5,
                title: 'Late Same Night Event',
                start: new Date(2015, 3, 17, 19, 30, 0),
                end: new Date(2015, 3, 17, 23, 30, 0),
            },
            {
                id: 13,
                title: 'Multi-day Event',
                start: new Date(2015, 3, 20, 19, 30, 0),
                end: new Date(2015, 3, 22, 2, 0, 0),
            },
            {
                id: 14,
                title: 'Today',
                start: new Date(new Date().setHours(new Date().getHours() - 3)),
                end: new Date(new Date().setHours(new Date().getHours() + 3)),
            },
        ]
        
        let events = [];
        let token = localStorage.getItem('TOKEN');
        let opts = {}
        opts.headers = { Authorization: token }
        axios.get('/bussiness/calendar', opts)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.msg));

            

            return myEventsList;    
    }


    @action updateBusinessArr(filter){
        this.business = filter;
    }

}

// initialize our store
const store = new Store();
export default store;