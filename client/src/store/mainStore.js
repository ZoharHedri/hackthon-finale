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

    @action setResetPasswordForm = (obj) => {
        this.resetPasswordForm[obj.key] = obj.value;
    }

    @action setForgotPasswordForm = (obj) => {
        this.forgotPasswordForm[obj.key] = obj.value;
    }

    @observable clients = [];

    @observable message = null;

    @action isExists = (user) => {
        if (user === "Bussiness") {
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

    //login to a database using email - BUSSINESS or CLIENT return
    @action login = () => {
        axios.post('/users/login', this.loginForm)
            .then(res => {
                if (res.data.success) {
                    // we saved the token from the server in localstorage
                    localStorage.setItem('TOKEN', res.data.token);
                    this._clearErrors();
                } else {
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
        axios.get('/bussiness/clients', opts)
            .then(res => {
                this.clients = res.data.clients;
                this._clearErrors();
            })
            .catch(err => {
                this._addError(err.msg);
            });
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
}

// initialize our store
const store = new Store();
export default store;