import store from '@/store';
import axios from 'axios';
import Vue from 'vue';

type UserLogin = {
    email: string;
    password: string;
};

type UserRegister = {
    name: string;
    email: string;
    password: string;
};

export class User {
    get name(): string {
        return store.getters['user'].name;
    }

    get email(): string {
        return store.getters['user'].email;
    }

    login(userLogin: UserLogin) {
        if (!userLogin.email || !userLogin.password) {
            throw new Error('Invalid email/password.');
        }

        return axios.post(`/login`, {
            email: userLogin.email,
            password: userLogin.password
        });
    }

    register(userRegister: UserRegister) {
        return axios.post(`/users`, {
            name: userRegister.name,
            email: userRegister.email,
            password: userRegister.password
        });
    }

    async auth(token: string) {
        if (!token) {
            throw new Error('Invalid token.');
        }
        try {
            const result = await axios.post(
                `/me`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await store.dispatch('LOGIN_ACTION', {
                token: token,
                userData: {
                    name: result.data.name,
                    email: result.data.email
                }
            });

            localStorage.setItem('token', token);
            Vue.prototype.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            store.dispatch('LOGOUT_ACTION');
            localStorage.removeItem('token');
        }
    }
}
