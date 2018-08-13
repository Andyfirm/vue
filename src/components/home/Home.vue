<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo-box">
        <img src="../../assets/images/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapse ? '64px' : '200px'">
        <div class="toggle_bar" @click="collapse=!collapse">|||</div>
        <!-- 左侧的menu菜单 开始  -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :collapse="collapse" :collapse-transition="false" :router="true">
          <!-- 子菜单 -->
          <el-submenu :index="item.id + ''" v-for="(item, i) in menulist" :key="item.id" :style="collapse ? 'width: 64px;' : 'width: 200px;'">
            <template slot="title">
              <i :class="['iconfont', iconList[i]]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 子菜单的 item 项 -->
            <el-menu-item :index="'/' + item.path" v-for="subItem in item.children" :key="subItem.id">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 左侧的menu菜单 结束 -->
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconList: ['icon-users', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'],
      collapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取左侧菜单失败！')
      this.menulist = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    padding-right: 20px;
    .logo-box {
      display: flex;
      color: #fff;
      font-size: 22px;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    user-select: none;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.toggle_bar {
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 25px;
  background: #4a5064;
  user-select: none;
  cursor: pointer;
  letter-spacing: 0.1em;
}
</style>
