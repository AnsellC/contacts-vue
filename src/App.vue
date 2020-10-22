<template>
    <v-app>
        <template v-if="$isSinglePage">
            <v-alert
                text
                v-if="hasMessage"
                class="rounded-0"
                :type="message.type"
                v-html="message.text"
                dismissible
            ></v-alert>
            <v-main>
                <router-view></router-view>
            </v-main>
        </template>
        <template v-else>
            <v-main>
                <v-alert
                    text
                    v-if="hasMessage"
                    class="rounded-0"
                    :type="message.type"
                    v-html="message.text"
                    dismissible
                ></v-alert>
                <v-container class="py-12">
                    <router-view></router-view>
                </v-container>
            </v-main>
        </template>
    </v-app>
</template>

<script lang="ts">
import BaseClass from '@/base';
import { Component, Watch } from 'vue-property-decorator';

@Component
export default class App extends BaseClass {}
</script>

<style lang="scss">
.theme--dark {
    .v-application {
        background: #222430 !important;
    }

    .v-card,
    .v-navigation-drawer {
        background: #181a26;
    }
}

.v-btn {
    letter-spacing: 0;
    text-transform: none;
    font-weight: bold;
}
</style>
