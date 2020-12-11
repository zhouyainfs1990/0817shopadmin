<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="add">添加</el-button>

    <!-- 表格 
        data:表格数据
        tree-props:数据数据模式
            children:子级数据的名称key
            hasChildren: 有子级数据

        row-key: 指定 行唯一标识属性ssss
    -->
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <!-- 每一行数据都是对象， -->
      <!-- 列表 
        prop 指定渲染的数据对象 key
      -->
      <el-table-column label="角色名称" width="180" prop="rolename"></el-table-column>

      <el-table-column label="状态" width="180">
        <!-- 数据不能作为文本渲染，需要作用域插槽 -->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success" effect="dark">启用</el-tag>
          <el-tag v-else type="danger" effect="dark">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <!-- scoped.row ：数据对象 -->
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->

    <el-dialog :title="isAdd?tip+'新增':tip+'角色编辑'" :visible.sync="isShow" @open="openFn" @close="closeFn">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <!--  -->
        <el-form-item label="菜单权限">
            <!-- 
                data:数据
                show-checkbox: 显示多选框
                check-strictly：在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false

                node-key: 节点标识，使用id
                default-checked-keys:默认选择
                props:指定子菜单的数据，
                    children:子级数据的key
                    label:关联文本的key
                -->
          <el-tree
            ref="tree"
            :data="data"
            show-checkbox
            node-key="id"
            check-strictly
            :default-checked-keys="checkedMenus"
            :props="{
                children: 'children',
                label: 'title'}"
          ></el-tree>
        </el-form-item>

        <el-form-item label="状态">
          <!-- {{form.status}} -->
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from "qs";
let defaultData = {
  menus: "", //上级菜单分类
  rolename: "",
  status: true
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      isAdd: true, //新增还是编辑状态

      form: {
        ...defaultData
      },
      data: [], //树形组件的数据
      rules: {
        rolename: [
          {
            required: true,
            message: "请输入菜单名称"
          }
        ]
      },
      tip:"角色",
      checkedMenus:[]
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 获取树形菜单列表
    async getMenuData() {
      let res = await this.$http.get("/api/menulist", {
        params: { istree: true }
      });
      console.log(res);
      if (res.code == 200) {
        this.data = res.list;
      }
    },
    // 确定按钮
    submitFn() {
        console.log()
      // 根据isAdd 判断进行 添加还是修改
      let url = this.isAdd ? "/api/roleadd" : "/api/roleedit";

    //   [1,2,3]->"1,2,3"   join
      console.log(this.$refs.tree.getCheckedKeys());
      this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
      // 状态修改为number值
      this.form.status = this.form.status ? 1 : 2;
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.$http.post(url, this.form);
          console.log(res);
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getTableData();
            this.isShow = false;
          } else if (res.code == 500) {
            this.$message.error(res.msg);
          }
        }
      });
    },
    // 对话框打开,获取顶级菜单列表
    openFn() {
      this.getMenuData();
    },
    // 对话框关闭，清空表单数据
    closeFn() {
      this.form = {
        ...defaultData
      };
      this.isAdd = true;
      this.checkedMenus = [];
    },
    // 点击添加按钮
    add() {
      this.isShow = true;
    },

    // 获取表格
    async getTableData() {
      let res = await this.$http.get("/api/rolelist");
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    // 编辑
    async handleEdit(row) {
      // console.log(row);

      this.isAdd = false;
      let res = await this.$http.get("/api/roleinfo", {
        params: { id: row.id }
      });
      console.log(res);
      if (res.code == 200) {
        this.isShow = true;
        res.list.status = res.list.status == 1 ? true : false;

        this.checkedMenus = res.list.menus.split(",");
        this.form = {
          ...res.list,
          id: row.id //编辑时需要id,后台返回数据没有id,自行添加
        };
      } else if (res.code == 500) {
        this.$message.error(res.msg);
      }
    },
    // 删除
    async handleDelete(row) {
      try {
        // 提示删除操作是否进行
        await this.$confirm(`此操作将删除该${this.tip}, 是否继续?`, "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // console.log(qs.stringify({id:1,name:2}))
        // 进行删除操作，点击了删除确定按钮
        let res = await this.$http.post("/api/roledelete", { id: row.id });
        console.log(res);
        if (res.code == 200) {
          this.tableData = [...res.list];
        }
      } catch (error) {
        // 点击取消按钮
      }
    }
  }
};
</script>