<template>
    <v-dialog v-model="syncedShow" width="600">
        <v-form ref="form" @submit.prevent="saveNewContact()">
            <v-card>
                <v-card-title>Add a Contact</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="name"
                        :rules="rules.name"
                        rounded
                        filled
                        class="rounded-lg"
                        label="Name"
                    ></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-row align="center">
                        <template v-for="(entry, i) in entries">
                            <v-col cols="12" md="4" :key="`type-field-${i}`">
                                <v-select
                                    hide-details
                                    label="Type"
                                    rounded
                                    filled
                                    class="rounded-lg"
                                    :items="['email', 'phone']"
                                    v-model="entry.type"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="7" :key="`value-field-${i}`">
                                <v-text-field
                                    hide-details
                                    :label="
                                        entry.type === 'email' ? 'Email Address' : 'Phone Number'
                                    "
                                    rounded
                                    :rules="rules.notEmpty"
                                    filled
                                    class="rounded-lg"
                                    v-model="entry.value"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="1" :key="`button-field-${i}`" v-if="entries.length > 1">
                                <v-btn icon small color="red">
                                    <v-icon @click="deleteContactEntry(i)"
                                        >mdi-delete-outline</v-icon
                                    >
                                </v-btn>
                            </v-col>
                        </template>
                    </v-row>
                </v-card-text>
                <v-card-text>
                    <v-row align="center">
                        <v-col cols="6">
                            <v-btn depressed small text @click="addMoreContactEntry()"
                                >Add More Contact Methods</v-btn
                            >
                        </v-col>
                        <v-col cols="6" class="text-right">
                            <v-btn
                                depressed
                                class="mr-4"
                                :disabled="loading"
                                @click="syncedShow = false"
                                >Cancel</v-btn
                            >
                            <v-btn
                                depressed
                                color="primary"
                                :disabled="loading"
                                :loading="loading"
                                type="submit"
                                >Save</v-btn
                            >
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-form>
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
    @PropSync('show', { type: Boolean }) syncedShow!: boolean;

    name = '';
    entries: ContactEntry[] = [
        {
            type: 'email',
            value: ''
        }
    ];

    addMoreContactEntry() {
        this.entries.push({
            type: 'email',
            value: ''
        });
    }

    deleteContactEntry(index: number) {
        this.entries.splice(index, 1);
    }

    async saveNewContact() {
        this.clearMessage();

        if (!this.$refs.form.validate()) {
            return;
        }
        this.loading = true;
        try {
            const contact = new Contact(this.name);
            await contact.add();
            const promises = [];
            for (const entry of this.entries) {
                if (!entry.value) {
                    continue;
                }
                promises.push(
                    contact.addEntry({
                        type: entry.type,
                        value: entry.value
                    })
                );
            }
            await Promise.all(promises);
            this.entries = [];
            this.name = '';

            this.syncedShow = false;
            this.$root.$emit('reloadContacts');
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
