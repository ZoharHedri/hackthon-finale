import { observable, action } from 'mobx';
// TODO: here we will handle all of our states
class Store {
    @observable register = {
        name: "",
        phone: "",
        category: "",
        email: "",
        password: "",
        address: ""
    }

    @observable login = {
        email: "",
        password: ""
    }

    @action setRegister = (obj) => {
        this.register[obj.key] = obj.value;
        console.log('data chaged..');
    }

    @action setLogin = (obj) => {
        this.login[obj.key] = obj.value;
        console.log(this.login.email + ',' + this.login.password);
    }



    @observable bussinessCalendar = {
        startPeriod: Date,
        endPeriod: Date,
        workDays: []
    }

    @action setBussinessCalendar = (obj) => {
        this.bussinessCalendar[obj.key] = obj.value;
        console.log('setBussinessCalendar chaged..');
    }

}

// initialize our store
const store = new Store();
export default store;