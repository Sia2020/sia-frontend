import Vue from 'vue'
import App from './App.vue'
import VueNativeSock from 'vue-native-websocket'

import "@/assets/global.css"

Vue.config.productionTip = false
Vue.use(VueNativeSock, 'ws://sia-app-websockets.herokuapp.com:3000/')

new Vue({
  render: h => h(App),
}).$mount('#app')
