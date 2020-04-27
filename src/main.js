import Vue from 'vue'
import App from './App.vue'
import VueNativeSock from 'vue-native-websocket'

import "@/assets/global.css"

Vue.config.productionTip = false
Vue.use(VueNativeSock, 'wss://sia-backend-copy.herokuapp.com/', {
  reconnection: true,
  format: 'json',
})

new Vue({
  render: h => h(App),
}).$mount('#app')
