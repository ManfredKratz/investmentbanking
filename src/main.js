import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import AsyncComputed from 'vue-async-computed'
import VueMask from 'v-mask'

Vue.config.productionTip = false

export const bus = new Vue();


Vue.use(AsyncComputed);
Vue.use(VueMask);

new Vue({
  /* eslint-disable no-new */
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
