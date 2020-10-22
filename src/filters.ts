import { capitalize } from 'lodash';
import Vue from 'vue';

Vue.filter('capitalize', (value: string) => {
    return capitalize(value);
});
