import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { camelCase, upperFirst } from 'lodash';
import axios from 'axios';
import config from '@/constants/site';
import { User } from './models/user';
import '@/filters';

axios.defaults.baseURL = config.apiUrl;
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$user = new User();
// Automatic component registration
const requireComponent = require.context('./components', true, /[A-Z]\w+\.(vue|js)$/);

requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName);
    const componentName = upperFirst(
        camelCase(
            fileName
                .split('/')
                .pop()
                ?.replace(/\.\w+$/, '')
        )
    );

    Vue.component(componentName, componentConfig.default || componentConfig);
});

(async function() {
    const token = localStorage.getItem('token');
    if (token) {
        await Vue.prototype.$user.auth(token);
    }

    router.beforeEach((to, from, next) => {
        const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
        const requiresGuest = to.matched.some(x => x.meta.requiresGuest);
        const isSinglePage = to.matched.some(x => x.meta.isSinglePage);
        const isLoggedIn = store.getters['isLoggedIn'];

        Vue.prototype.$isSinglePage = isSinglePage;

        if (requiresAuth && !isLoggedIn) {
            next('/login');
        } else if (requiresGuest && isLoggedIn) {
            next('/');
        } else {
            next();
        }
    });

    new Vue({
        router,
        store,
        vuetify,
        render: h => h(App)
    }).$mount('#app');
})();
