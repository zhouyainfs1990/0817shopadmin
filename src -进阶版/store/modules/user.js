import {login} from "@/api/user"
import {Message} from "element-ui"
import router from "@/router"

// VUEX中 user模块
const state =()=>{
    
    let info;
    // 存在 info说明用户已登录
    if(localStorage.getItem("info")){
        // 保存在localStorage中的 info 作为vuex user  state中的info
        info = JSON.parse(localStorage.getItem("info"))
    }else{
        // 未登录
        info = {};
    }
    return {
        info
    }
}

const getters = {
    username(state){
        return state.info.username
    }
}

const mutations = {
    SET_INFO(state,info){
        state.info = info
    }
}

const actions = {
    // 
    async set_info({commit},data){
        console.log(data)
        let info = await login(data)
        if(info.code==200){
            // 将登录信息保存在 localStorage中，数据持久化（vuex的数据刷新会重置）
            localStorage.setItem("info",JSON.stringify(info.list));
            localStorage.setItem("token",JSON.stringify(info.list.token));
            commit("SET_INFO",info)
            router.replace("/")
           
        }else{
            console.log(info)
            Message.error(info.msg);
        }
    }
}

export default{
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}
