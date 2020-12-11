import Vue from 'vue'
import Router from 'vue-router'
import url from 'postcss-url'


Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login',
      component:()=>import("@/pages/Login")
    },
    {
      path: '/',
      component:()=>import("@/pages/Layout"),
      children:[{
        path:"index",
        component:()=>import("@/pages/Index")
      },{
        path:"menu",
        component:()=>import("@/pages/Menu")
      },{
        path:"role",
        component:()=>import("@/pages/Role")
      },{
        path:"user",
        component:()=>import("@/pages/User")
      },{
        path:"category",
        component:()=>import("@/pages/Cate")
      },{
        path:"specs",
        component:()=>import("@/pages/Specs")
      },{
        path:"goods",
        component:()=>import("@/pages/Goods")
      },{
        path:"*",
        redirect:"/index"
      }]
    }
  ]
})


router.beforeEach((to,from,next)=>{
  // 以是否存在token判断是否登录
  let token = localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")).token:false;
  // 后台允许该账号访问的前端页面路由
  let urls = localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")).menus_url:[];
  if(token){
    if(to.path=="/login"){
      next(false);
    }else{
      // 添加后台没有的路由 
      urls.push("/","/index")
      // console.log(urls)
      // next();
      
      // 判断前往路由是否是后台允许访问的路由
      let flag = urls.indexOf(to.path)>-1;
      // let flag = urls.includes(to.path)
      console.log(flag)
      // 可以访问
      if(flag){
        next()
      }else{
        // 不可以访问的
        next(false)
      }
    }
  }else{
    // 未登录
    if(to.path=="/login"){
      next()
    }else{
      next("/login")
    }
  }
})

export default router
