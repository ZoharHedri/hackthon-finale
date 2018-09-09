import { observable, action, computed } from 'mobx';
import axios from 'axios';
import moment from 'moment';
import Pusher from 'pusher-js';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;
class Store {

    constructor() {
        this.pusher = new Pusher('c5026332b4de2d5a6839', {
            cluster: 'ap2',
            forceTLS: true
        });
        this.channelBussiness = this.pusher.subscribe('bussiness');
        this.channelBussiness.bind('get-events', (data) => {
            // console.log('pusehr-data', data);
            if (this.activityId === data.activityId)
                this.workingDays = data.workingDays;
            // this.open = true;
        })
    }

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

    @observable clientEventForm = {
        activityId: "",
        timeDate: {
            date: "",
            startingTime: "",
        },
        status: ""
    }

    @observable resetPasswordForm = {
        password: "",
        passwordConfirm: ""
    }

    @observable userStatus = {
        loggedIn: false,
        userModel: ""
    }
    @observable business = [];
    @observable clients = [];
    @observable events = [];
    @observable activities = [];

    @observable client = {};
    @observable clientEvents = [];

    @observable message = null;
    @observable errors = [];
    @observable workingDays = [];
    // @observable open = false;

    token = localStorage.getItem('TOKEN');
    options = { headers: { "Authorization": this.token } };



    @action removeActivity = async (activity_id) => {
        try {
            let res = await axios.delete(`/activities/delete/${activity_id}`, this.options);
            console.log(res.data);
        } catch (err) { console.log(err) };
    }

    @action setCientEventForm = (obj) => {
        if (obj.key) {
            this.clientEventForm[obj.key] = obj.value;
        } else {
            let setTimeDate = {
                date: obj.date,
                startingTime: obj.startingTime
            }
            this.clientEventForm["timeDate"] = setTimeDate;
        }
    }

    activityId = "";

    @action saveEventForClient = async (bussinessId, workingDayId) => {
        try {
            await axios.post(`/clients/events/add/${bussinessId}/${workingDayId}`, this.clientEventForm, this.options);
            this.getClientEvents();
        } catch (err) { console.log(err) };
    }

    @action setActivityForm = (obj) => {
        this.activityForm[obj.key] = obj.value;
    }

    @action addActivity = async () => {
        try {
            let activits = this.activityForm;
            let res = await axios.post('/activities/addActivity', activits, this.options);
            console.log(res.data)
        } catch (err) { console.log(err) };
    }


    @action getClientEvents = async () => {
        try {
            let res = await axios.get('/clients/events', this.options);
            this.client = res.data.client;
            this.clientEvents = res.data.events;
        } catch (err) { console.log(err) };
    }

    @action removeEventById = async (eventId) => {
        try {
            let res = await axios.delete(`/clients/event/${eventId}`, this.options);
            if (res.data.success) {
                this.getClientEvents();
            }
        } catch (err) { console.log(err) };
    }




    @computed get getSetting() {
        return this.registerBussinessForm;
    }

    @action getSettingApi = async () => {
        try {
            let res = await axios.get('/bussiness/setting', this.options);
            this.registerBussinessForm = res.data.info;
        } catch (err) { console.log(err) };
    }

    @action _setErrors = (errors) => {
        this.errors = errors;
    }



    @action automaticLogin = async () => {
        try {
            if (!this.token) return;
            let res = await axios.get('/users/automaticLogin', this.options);
            if (res.data.success) {
                let user = {
                    loggedIn: true,
                    userModel: res.data.user === 'business' ? res.data.user + "/dashboard" : res.data.user + '/search'
                }
                this.userStatus = user;
            }
        }
        catch (err) {
            this.userStatus.loggedIn = false;
        }
    }


    @action setResetPasswordForm = (obj) => {
        this.resetPasswordForm[obj.key] = obj.value;
    }

    @action setForgotPasswordForm = (obj) => {
        this.forgotPasswordForm[obj.key] = obj.value;
    }

    @action isExists = async (user) => {
        try {
            if (user === "bussiness") {
                if (this.registerBussinessForm.email === "") {
                    this.message = null;
                    return;
                }
                let res = await axios.post('/bussiness/isExists', { email: this.registerBussinessForm.email })
                this.message = res.data.msg;
                return;
            }
            if (this.registerClientForm.email === "") {
                this.message = null;
                return;
            }
            let res = await axios.post('/clients/isExists', { email: this.registerClientForm.email })
            this.message = res.data.msg;
        } catch (err) { console.log(err.msg) };
    }

    @action setRegisterBussinessForm = (obj) => {
        this.registerBussinessForm[obj.key] = obj.value;
    }

    @action clearRegisterBussinessForm = () => {
        this.registerBussinessForm.name = "";
        this.registerBussinessForm.email = "";
        this.registerBussinessForm.address = "";
        this.registerBussinessForm.category = "";
        this.registerBussinessForm.confirmPassword = "";
        this.registerBussinessForm.oldPassword = "";
        this.registerBussinessForm.password = "";
        this.registerBussinessForm.phone = "";
    }

    @action setLoginForm = (obj) => {
        this.loginForm[obj.key] = obj.value;
    }

    @action clearLoginForm = () => {
        this.loginForm.email = "";
        this.loginForm.password = "";
    }


    // register bussiness to database
    @action registerBussiness = async () => {
        let res = await axios.post('/bussiness/register', this.registerBussinessForm);
        if (!res.data.success) this.errors = res.data.errors;
        this.clearRegisterBussinessForm();
    }

    // register client to database
    @action registerClient = async () => {
        try {
            let fd = new FormData();
            for (let key in this.registerClientForm) {
                fd.append(key, this.registerClientForm[key])
            }
            let opts = { headers: { 'Content-Type': 'multipart/form-data' } };
            let res = await axios.post('/clients/register', fd, opts)
            if (res.data.success) {
                return res.data.success;
            } else {
                this.errors = res.data.errors;
            }
        } catch (err) { console.log(err.msg) };
    }

    //login to a database using email - BUSSINESS or CLIENT return
    @action login = async () => {
        try {
            let res = await axios.post('/users/login', this.loginForm)
            if (res.data.success) {
                // we saved the token from the server in localstorage
                localStorage.setItem('TOKEN', res.data.token);
                this.token = res.data.token;
                this.options = { headers: { "Authorization": this.token } };
                let user = {
                    loggedIn: true,
                    userModel: res.data.user === 'business' ? res.data.user + "/dashboard" : res.data.user + '/search'
                }
                this.userStatus = user;
                this._clearErrors();
            } else {
                this.loggedIn = false;
                this._addError(res.data.msg);
            }
            this.clearLoginForm();

        } catch (err) { this._addError(err.msg) };
    }


    @action setRegisterClientForm = (obj) => {
        this.registerClientForm[obj.key] = obj.value;
    }

    @action getClients = async () => {
        try {
            let res = await axios.get('/bussiness/clients', this.options);
            this.clients = res.data.clients;
            this._clearErrors();
        } catch (err) {
            this._addError(err.msg);
        };
    }

    @action logout = () => {
        localStorage.removeItem("TOKEN");
        this.token = null;
        this.options = { headers: { "Authorization": this.token } };
        let user = {
            loggedIn: false,
            userModel: ""
        }
        this.userStatus = user;
    }

    @action _clearMessage = () => {
        this.message = "";
    }

    @action forgot = async () => {
        try {
            let res = await axios.post('/users/password/forgot', this.forgotPasswordForm);
            if (res.data.success) {
                this._clearErrors();
            } else {
                this._addError(res.data.msg);
            }
        } catch (err) { this.errors = err.response.data.errors };
    }

    @action resetPassword = async (token) => {
        try {
            let res = await axios.post('/users/password/reset/' + token, { password: this.resetPasswordForm.password });
            console.log(res.data);
        } catch (err) { console.log(`${err}`) };
    }

    @action getActivities = async () => {
        try {
            let res = await axios.get('/activities', this.options)
            this.activities = res.data.activites
        } catch (err) { console.log(err) };
    }

    _addError = (message) => {
        if (!this.errors.find(err => err === message)) {
            this.errors.push(message);
        }
    }
    _clearErrors = () => {
        this.errors.length = 0;
    }

    @action updateBusinessArr = (filter) => {
        this.business = filter;
    }



    @observable bussinessCalendar = {
        startPeriod: moment().startOf('month').format("YYYY-MM-DD"),
        endPeriod: moment().endOf('month').format("YYYY-MM-DD"),
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
    }


    @action setBussinessCalendarDay = (dayName) => {
        let findDay = this.bussinessCalendar.workDays.find(item => dayName === item.day);
        findDay.flag = !findDay.flag;
    }


    @action setBussinessCalendarDayTime = (obj) => {
        this.bussinessCalendar.workDays[0][obj.key] = obj.value;
    }



    @action setBussinessCalendarWorkDays = async (periodWorkDays) => {
        try {
            let res = await axios.post('/bussiness/calendar/', periodWorkDays, this.options)
            console.log(res.data);
        } catch (err) { console.log(err.msg) };
    }


    _getBussinessEvents = async () => {
        try {
            let res = await axios.get('/bussiness/calendar', this.options);
            let mapped = res.data.events.map(item => {
                let start = moment(item.date, "DD/MM/YYYY");
                start.add(Number(item.startingTime.split(":")[0]), 'hours');
                start.add(Number(item.startingTime.split(":")[1]), 'minutes');
                let end = start.clone();
                end.add(item.activityId.duration, 'minutes');
                let obj = {
                    id: item._id,
                    title: item.activityId.type,
                    start: start.toDate(),
                    end: end.toDate()
                }
                return obj;
            });
            this.events = mapped;
        }
        catch (err) { console.log(err.msg) };
    }


    @action updateBusinessArr(filter) {
        this.business = filter;
    }

}

// initialize our store
const store = new Store();
export default store;