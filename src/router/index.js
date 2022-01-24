import Vue from 'vue';
import VueRouter from 'vue-router';
import customer from '../views/customer/customer.vue';
import consultant from '../views/consultants/consultant.vue';
import funds from '../views/funds/funds.vue';
import login from '../views/auth/login.vue';
import NotFound from '../components/others/NotFound.vue';

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: login},
    { path: '/customer', component: customer },
    { path: '/consultant', component: consultant },
    { path: '/funds', component: funds },
    { path: '/login', component: login },
    { path: '*', component: NotFound }
  ],
});

export default router
