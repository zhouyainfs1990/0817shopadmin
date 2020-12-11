import Vue from "vue"
import Vuex from "Vuex"
import user from "./modules/user"
Vue.use(Vuex);

let store = new Vuex.Store({
    state:{

    },
    modules:{
        // 注册为user模块
        user
    }
})

export default store