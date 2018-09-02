import { observable, action, computed } from 'mobx';
import axios from 'axios';
import moment from 'moment';
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

    @observable clients = [];
    @observable clientEvents = [];

    @observable message = null;

    @observable business = [];

    @observable events = [];


    @observable clientEventForm = {
        activityId: "",
        timeDate: {
            date: "",
            startingTime: "",
        },
        status: ""
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

    @action saveEventForClient(bussinessId, workingDayId) {
        let token = localStorage.getItem('TOKEN');
        let options = {};
        options.headers = { "Authorization": token };
        axios.post(`/clients/events/add/${bussinessId}/${workingDayId}`, this.clientEventForm, options)
            .then(res => {
                // we need to fire upp some thing
                this.getClientEvents();
            })
    }

    @action setActivityForm = (obj) => {
        this.activityForm[obj.key] = obj.value;
    }

    @action addActivity = () => {
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

    @observable client = {};

    @action getClientEvents = () => {
        let token = localStorage.getItem('TOKEN');
        let options = {};
        options.headers = { "Authorization": token };
        axios.get('/clients/events', options)
            .then(res => {
                this.client = res.data.client;
                this.clientEvents = res.data.events;
            })
            .catch(err => console.log(err))
    }

    @action removeEventById = (eventId) => {
        let token = localStorage.getItem('TOKEN');
        let options = {};
        options.headers = { "Authorization": token };
        axios.delete(`/clients/event/${eventId}`, options)
            .then(res => {
                if (res.data.success) {
                    this.getClientEvents();
                }
            })
            .catch(err => console.log(err));
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
                            userModel: res.data.user === 'business' ? res.data.user + "/dashboard" : res.data.user + '/search'
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



    // @observable business = [];

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
        let fd = new FormData();
        for (let key in this.registerClientForm) {
            fd.append(key, this.registerClientForm[key])
        }
        let opts = {};
        opts.headers = { contentType: "multipart/form-data" };
        axios.post('/clients/register', fd, opts)
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
                        userModel: res.data.user === 'business' ? res.data.user + "/dashboard" : res.data.user + '/search'
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
        localStorage.removeItem("TOKEN");
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

    @action updateBusinessArr = (filter) => {
        this.business = filter;
    }



    @observable bussinessCalendar = {
        startPeriod: Date.now(),
        endPeriod: Date.now(),
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


    _getBussinessEvents() {
        let token = localStorage.getItem('TOKEN');
        let opts = {}
        opts.headers = { Authorization: token }
        axios.get('/bussiness/calendar', opts)
            .then(res => {
                let mapped = res.data.events.map(item => {
                    let start = moment(item.date);
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
                }
                );
                this.events = mapped;
                console.log(res.data);
            })
            .catch(err => console.log(err.msg));
    }


    @action updateBusinessArr(filter) {
        debugger;
        this.business = filter;
    }

}

// initialize our store
const store = new Store();
export default store;