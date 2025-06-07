import Vue from 'vue'
import App from './App.vue'

// 引入本地组件库（开发时用本地）
import OwUI from '../index.js'
Vue.use(OwUI)

new Vue({
  render: h => h(App)
}).$mount('#app')
