<template>
  <div class="login_bg">
    <div class="login_container">
      <h2>登录</h2>
      <!-- model:表单绑定的数据 -->
      <el-form :model="formData" :rules="rules" ref="form">
        <!-- prop指定 rules名为username的验证规则 -->
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="管理员名称"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" placeholder="管理员密码"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="login_btn" @click="loginFn">登录</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: ""
      },
      // 验证规则
      rules: {
        // 验证 username
        username: [
          {
            required: true, //必填
            message: "请输入管理员名称", //验证提示信息
            trigger:"blur"
          }
        ],
        password: [
          {
            required: true, //必填
            message: "请输入管理员名称", //验证提示信息
            trigger:"blur"
          },
          {
            max: 8, //最大长度
            min: 5,
            message: "密码长度为5-8个字符", //验证提示信息
            trigger:"blur"
          }
        ]
      }
    };
  },
  mounted(){
    console.log(this.$store.state.user)
  },
  methods: {
    loginFn() {
        // 使用rules定义的验证规则进行验证的方法
        // 回调函数在验证结束后触发,回调参数就是验证结果
        //valid: true->验证通过，false 验证失败
      this.$refs.form.validate(valid => {
        // console.log(valid)
        // 验证通过发送请求
        if(valid){
            // 发出user模块 set_info这个action
            this.$store.dispatch("user/set_info",this.formData)
        }
      });
    }
  }
};
</script>

// scoped属性，style标签中样式只对当前组件生效
<style lang="less" scoped>
.login_bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
  .login_container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 300px;
    height: 300px;
    h2 {
      text-align: center;
      color: #fff;
      margin: 20px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>