import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        message: {
            type: undefined,
            text: ''
        },
        token: '',
        user: {
            email: '',
            name: ''
        }
    },
    getters: {
        message: state => state.message,
        token: state => state.token,
        user: state => state.user
    },
    mutations: {},
    actions: {}
});
