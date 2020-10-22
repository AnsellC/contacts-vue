<template>
    <v-dialog v-model="syncedShow" width="600" @input="updateInput">
        <v-card>
            <v-card-title>View Contact</v-card-title>
            <v-card-text class="text-h5 font-weight-bold primary--text text-center">
                <template v-if="editName">
                    <div class="d-flex align-center">
                        <v-text-field
                            hide-details
                            v-model="syncedContact.name"
                            :rules="rules.name"
                            rounded
                            filled
                            class="rounded-lg mr-4"
                            label="Name"
                            @blur="updateName()"
                            :loading="loading"
                        ></v-text-field>
                        <v-btn icon @click="updateName()">
                            <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                    </div>
                </template>
                <template v-else>
                    {{ contact.name }}
                    <v-btn icon class="ml-4" small>
                        <v-icon @click="editName = true" small>mdi-pencil-outline</v-icon>
                    </v-btn>
                </template>
            </v-card-text>

            <v-card-text>
                <template v-if="syncedContact.entries.length === 0">
                    <div style="height: 100px;" class="d-flex align-center justify-center">
                        No contact details
                    </div>
                </template>
                <v-list v-else>
                    <template v-for="(entry, i) in syncedContact.entries">
                        <v-list-item :key="`entry-${i}`">
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold">
                                    {{ entry.value }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ entry.type | capitalize }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon small color="red" :loading="deletingEntry">
                                    <v-icon @click="deleteContactEntry(entry.id)"
                                        >mdi-delete-outline</v-icon
                                    >
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider
                            :key="`entry-div-${i}`"
                            v-if="i + 1 < syncedContact.entries.length"
                        ></v-divider>
                    </template>
                </v-list>
            </v-card-text>
            <v-card-text v-if="addingNewEntry">
                <v-row align="center">
                    <v-col cols="12" md="4">
                        <v-select
                            hide-details
                            label="Type"
                            rounded
                            filled
                            class="rounded-lg"
                            :items="['email', 'phone']"
                            v-model="additionalContactEntry.type"
                        >
                        </v-select>
                    </v-col>
                    <v-col cols="12" md="7">
                        <v-text-field
                            hide-details
                            :label="
                                additionalContactEntry.type === 'email'
                                    ? 'Email Address'
                                    : 'Phone Number'
                            "
                            rounded
                            :rules="rules.notEmpty"
                            filled
                            class="rounded-lg"
                            v-model="additionalContactEntry.value"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon :loading="savingNewEntry">
                            <v-icon @click="saveNewEntry()">mdi-content-save</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text>
                <v-row align="center">
                    <v-col cols="6">
                        <v-btn
                            depressed
                            small
                            text
                            @click="addingNewEntry = true"
                            :disabled="addingNewEntry"
                        >
                            Add More Contact Methods
                        </v-btn>
                    </v-col>
                    <v-col cols="6" class="text-right">
                        <v-btn
                            depressed
                            class="mr-4"
                            :disabled="loading"
                            @click="syncedShow = false"
                            >Close</v-btn
                        >
                        <v-btn
                            depressed
                            color="primary"
                            :disabled="loading"
                            :loading="deleting"
                            @click="deleteContact()"
                            >Delete</v-btn
                        >
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">
import BaseClass from '@/base';
import { Component, PropSync } from 'vue-property-decorator';
import { Contact } from '@/models/contact';
import { parseError } from '@/functions';
import rules from '@/constants/rules';

@Component
export default class AddContactComponent extends BaseClass {
    rules = rules;
    deleting = false;
    additionalContactEntry: ContactEntry = {
        type: 'email',
        value: ''
    };
    @PropSync('show', { type: Boolean }) syncedShow!: boolean;

    @PropSync('contact', { type: Object }) syncedContact!: ContactItem;
    editName = false;
    deletingEntry = false;
    addingNewEntry = false;
    savingNewEntry = false;

    updateInput(evt: boolean) {
        this.editName = evt;
        this.additionalContactEntry = {
            type: 'email',
            value: ''
        };
        this.deletingEntry = false;
        this.addingNewEntry = false;
        this.savingNewEntry = false;
    }

    async deleteContact() {
        this.deleting = true;
        try {
            const contact = new Contact();
            contact.populate(this.syncedContact);
            await contact.delete();
            this.$root.$emit('reloadContacts');
        } catch (err) {
            const error = parseError(err.response.data);
            this.setMessage({
                type: 'error',
                text: error.message,
                errors: error.details
            });
        }

        this.deleting = false;
        this.syncedShow = false;
    }

    async saveNewEntry() {
        this.loading = true;
        this.savingNewEntry = true;
        try {
            const contact = new Contact();
            contact.populate(this.syncedContact);
            await contact.addEntry({
                type: this.additionalContactEntry.type,
                value: this.additionalContactEntry.value
            });
        } catch (err) {
            const error = parseError(err.response.data);
            this.setMessage({
                type: 'error',
                text: error.message,
                errors: error.details
            });
        }
        this.loading = false;
        this.addingNewEntry = false;
        this.savingNewEntry = false;
        this.additionalContactEntry = {
            type: 'email',
            value: ''
        };
    }

    async deleteContactEntry(id: number) {
        this.loading = true;
        this.deletingEntry = true;
        try {
            const contact = new Contact();
            contact.populate(this.syncedContact);
            await contact.deleteEntry(id);
        } catch (err) {
            const error = parseError(err.response.data);
            this.setMessage({
                type: 'error',
                text: error.message,
                errors: error.details
            });
        }
        this.loading = false;
        this.deletingEntry = false;
    }

    async updateName() {
        this.loading = true;
        try {
            const contact = new Contact();
            contact.populate(this.syncedContact);
            await contact.save();
            this.editName = false;
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
