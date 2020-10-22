import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { camelCase, upperFirst } from 'lodash';

Vue.config.productionTip = false;
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
