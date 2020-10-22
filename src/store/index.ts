import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

type UserData = {
    name: string;
    email: string;
};

type LoginActionParams = {
    userData: UserData;
    token: string;
};

export default new Vuex.Store({
    state: {
        message: {
            type: undefined,
            text: '',
            errors: []
        } as MessageType,
        token: '',
        user: {
            email: '',
            name: ''
        } as UserData,
        isLoggedIn: false
    },
    getters: {
        message: state => state.message,
        token: state => state.token,
        user: state => state.user,
        isLoggedIn: state => state.isLoggedIn
    },
    mutations: {
        SET_MESSAGE(state, message: MessageType) {
            state.message = message;
        },
        SET_USER(state, user: UserData) {
            state.user = user;
        },
        SET_TOKEN(state, token: string) {
            state.token = token;
        },
        SET_LOGIN(state, isLoggedIn: boolean) {
            state.isLoggedIn = isLoggedIn;
        }
    },
    actions: {
        CLEAR_MESSAGE_ACTION(context) {
            context.commit('SET_MESSAGE', {
                type: undefined,
                text: '',
                errors: []
            });
        },
        SET_MESSAGE_ACTION(context, message: MessageType) {
            context.commit('SET_MESSAGE', message);
        },
        LOGIN_ACTION(context, params: LoginActionParams) {
            context.commit('SET_USER', params.userData);
            context.commit('SET_TOKEN', params.token);
            context.commit('SET_LOGIN', true);
        },
        LOGOUT_ACTION(context) {
            context.commit('SET_USER', {
                name: '',
                email: ''
            });
            context.commit('SET_LOGIN', false);
            context.commit('SET_TOKEN', '');
        }
    }
});
