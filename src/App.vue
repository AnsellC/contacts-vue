<template>
    <v-app>
        <template v-if="$isSinglePage">
            <error></error>
            <v-main>
                <router-view></router-view>
            </v-main>
        </template>
        <template v-else>
            <v-main>
                <error></error>
                <v-container class="py-12">
                    <router-view></router-view>
                </v-container>
            </v-main>
        </template>
    </v-app>
</template>

<script lang="ts">
import BaseClass from '@/base';
import { Component } from 'vue-property-decorator';

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
