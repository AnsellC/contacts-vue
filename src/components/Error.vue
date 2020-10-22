<template>
    <v-alert
        text
        v-if="hasMessage && message.type === 'error' && message.errors.length > 0"
        class="rounded-0"
        type="error"
        dismissible
    >
        <strong>{{ message.text }}</strong>
        <ul>
            <li v-for="(msg, i) in message.errors" :key="`error-${i}`" v-html="msg"></li>
        </ul>
    </v-alert>

    <v-alert
        text
        v-else-if="hasMessage"
        class="rounded-0"
        :type="message.type"
        v-html="message.text"
        dismissible
    ></v-alert>
</template>

<script lang="ts">
import BaseClass from '@/base';
import { Component } from 'vue-property-decorator';

@Component
export default class ErrorComponent extends BaseClass {}
</script>
