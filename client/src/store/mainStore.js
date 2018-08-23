import { observable, action, computed } from 'mobx';
import axios from 'axios';

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


    @observable client = {
        name: "",
        phone: "",
        email: "",
        password: ""
    }

    @observable clients=[];

    @action setRegister = (obj) => {
        this.register[obj.key] = obj.value;
        console.log('data chaged..');
    }

    @action setLogin = (obj) => {
        this.login[obj.key] = obj.value;
        console.log(this.login.email + ',' + this.login.password);
    }


    @action setClient = (obj) => {
        this.client[obj.key] = obj.value;
        console.log('data chaged..');
    }

    @action getClients() {
        let token =localStorage.getItem('TOKEN');
        let opts = {}
        opts.headers = { Authorization: token }
        axios.get('/bussiness/clients', opts)
            .then(res => {
                this.clients = res.data.clients;
            })
            .catch(err => console.log(err.msg));
    }


}

// initialize our store
const store = new Store();
export default store;