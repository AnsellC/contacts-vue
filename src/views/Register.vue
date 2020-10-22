<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" offset-md="3">
                <v-card v-if="registered">
                    <v-card-text
                        >Account created successfully.
                        <router-link to="/login">Login now</router-link>
                    </v-card-text>
                </v-card>
                <v-form v-else @submit.prevent="register()" ref="form">
                    <v-card class="elevation-0">
                        <v-card-title>
                            Create an account
                        </v-card-title>
                        <v-card-text>
                            <v-text-field
                                rounded
                                filled
                                label="Full Name"
                                class="rounded-lg"
                                :rules="rules.name"
                                v-model="name"
                            ></v-text-field>

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
                            <v-btn :loading="loading" color="primary" type="submit"
                                >Create account</v-btn
                            >
                        </v-card-text>
                        <v-card-text class="text-center">
                            <router-link to="/login">Already have an account?</router-link>
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
export default class RegisterView extends BaseClass {
    rules = rules;
    name = '';
    email = '';
    password = '';
    registered = false;

    async register() {
        if (!this.$refs.form.validate()) {
            return;
        }

        const user = new User();
        this.loading = true;
        try {
            this.clearMessage();
            await user.register({
                name: this.name,
                email: this.email,
                password: this.password
            });
            this.registered = true;
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
