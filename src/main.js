import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import Axios from 'axios'

Vue.use(ElementUI)

Axios.defaults.baseURL = 'https://www.escook.cn:8888/api/private/v1/'
Vue.prototype.$http = Axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
