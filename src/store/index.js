import Vue from "vue"
import Vuex from "Vuex"

Vue.use(Vuex);

// localStorage 中存在info，说明已登录，vuex重新刷新，会被重制，可以从localStorage中获取一份
let info = localStorage.getItem("info")? JSON.parse(localStorage.getItem("info")):{};
let store = new Vuex.Store({
    state:{
        // 登录的用户信息
        info
    },
    getters:{
        username:state=>state.info.username
    },
    mutations:{
        SET_INFO(state,info){
            state.info = info;
        },
        CLEAR_INFO(state){
            state.info={}
        }
    }
})

export default store