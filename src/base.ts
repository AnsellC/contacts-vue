import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: {
        ...mapGetters(['message', 'auth'])
    }
})
export default class BaseClass extends Vue {
    $refs!: {
        form: HTMLFormElement;
    };

    // Loading state
    loading = false;

    // Initializing state
    initializing = false;

    // returns true if there's an alert message
    get hasMessage(): boolean {
        return this.$store.getters['message'].text.length > 0;
    }

    get message(): MessageType {
        return this.$store.getters['message'];
    }

    clearMessage() {
        this.$store.dispatch('CLEAR_MESSAGE_ACTION');
    }

    setMessage(message: MessageType) {
        this.$store.dispatch('SET_MESSAGE_ACTION', message);
    }
}
