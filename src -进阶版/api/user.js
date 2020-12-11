import axios from "./../utils/http"
// 进行登录请求的函数
async function login(data) {
    let res = await axios.post("/api/userlogin", data)
    console.log(res)
    return res;
}


export {login}