<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" offset-md="3">
                <v-form @submit.prevent="login()" ref="form">
                    <div class="pa-4 text-h4 font-weight-bold">Contacts App</div>
                    <v-card class="elevation-0">
                        <v-card-title>
                            Login
                        </v-card-title>
                        <v-card-text>
                            <v-text-field
                                rounded
                                filled
                                label="E-Mail"
                                class="rounded-lg"
                                :rules="rules.email"
                                v-model="email"
                            ></v-text-field>
                            <v-text-field
                                rounded
                                filled
                                label="Password"
                                class="rounded-lg"
                                type="password"
                                :rules="rules.password"
                                v-model="password"
                            ></v-text-field>
                        </v-card-text>
                        <v-card-text class="text-center">
                            <v-btn :loading="loading" color="primary" type="submit">Login</v-btn>
                        </v-card-text>
                        <v-card-text class="text-center">
                            Don't have an account yet?
                            <router-link to="/register">Create an account now</router-link>
                        </v-card-text>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts">
import BaseClass from '@/base';
import { Component } from 'vue-property-decorator';
import rules from '@/constants/rules';
import { User } from '@/models/user';
import { parseError } from '@/functions';

@Component
export default class LoginView extends BaseClass {
    rules = rules;
    email = '';
    password = '';

    async login() {
        if (!this.$refs.form.validate()) {
            return;
        }

        this.loading = true;
        const user = new User();
        try {
            const result = await user.login({
                email: this.email,
                password: this.password
            });

            await user.auth(result.data.token);
            window.location.href = '/';
        } catch (err) {
            const error = parseError(err.response.data);
            this.setMessage({
                type: 'error',
                text: error.message,
                errors: error.details
            });
        }
        this.loading = false;
    }
}
</script>
