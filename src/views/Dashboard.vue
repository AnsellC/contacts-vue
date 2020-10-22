<template>
    <div>
        <v-row align="center">
            <v-col cols="6">
                <h1>My Contacts</h1>
            </v-col>
            <v-col cols="6" class="text-right">
                <v-btn text @click="logout()">
                    Logout {{ $user.name }}
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <template v-if="loading">
            <div class="d-flex justify-center align-center" style="height: 400px;">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
        </template>
        <template v-else>
            <template v-if="contacts.length === 0">
                <v-sheet
                    height="400"
                    class="rounded-lg d-flex align-center justify-center flex-column text--secondary"
                >
                    <v-icon x-large class="mb-4">mdi-contacts-outline</v-icon>
                    <span class="text-h6 mb-12">
                        You don't have any contacts yet.
                    </span>
                    <v-btn x-large depressed @click="addContactDialog = true">Add Contact</v-btn>
                </v-sheet>
            </template>
            <template v-else>
                <v-row>
                    <v-col offset-md="3" md="6" cols="12">
                        <v-card>
                            <v-list two-line>
                                <template v-for="(contact, x) in contacts">
                                    <v-list-item
                                        @click="viewContact(contact)"
                                        :key="`contact-${x}`"
                                    >
                                        <v-list-item-avatar color="secondary">
                                            <v-icon>
                                                mdi-account-circle
                                            </v-icon>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title class="text-h6">
                                                {{ contact.name }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle v-if="contact.entries.length > 0">
                                                {{ contact.entries.length }} contact details
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-divider
                                        :key="`divider-${x}`"
                                        v-if="x + 1 < contacts.length"
                                    ></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </template>
        <add-contact :show.sync="addContactDialog"></add-contact>
        <show-contact :show.sync="showContactDialog" :contact.sync="showContact"></show-contact>
    </div>
</template>

<script lang="ts">
import BaseClass from '@/base';
import { parseError } from '@/functions';
import { Component } from 'vue-property-decorator';

@Component
export default class DashboardView extends BaseClass {
    addContactDialog = false;
    contacts: ContactItem[] = [];
    showContact: ContactItem = {
        name: '',
        entries: []
    };
    showContactDialog = false;

    async created() {
        this.loadContacts();
    }

    mounted() {
        this.$root.$on('reloadContacts', this.loadContacts);
    }

    async loadContacts() {
        this.loading = true;
        try {
            const result = await this.$axios.get(`/contacts`);
            this.contacts = result.data.data;
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

    viewContact(contact: ContactItem) {
        this.showContact = contact;
        this.showContactDialog = true;
    }

    async logout() {
        await this.$store.dispatch('LOGOUT_ACTION');
        localStorage.removeItem('token');
        window.location.href = '/';
    }
}
</script>

<style></style>
