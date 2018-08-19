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

    @action setRegister = (obj) => {
        this.register[obj.key] = obj.value;
        console.log('data chaged..');
    }
}

// initialize our store
const store = new Store();
export default store;