import Vue from 'vue';

export class Contact {
    id!: number;
    name = '';
    entries: ContactEntry[] = [];

    constructor(name?: string) {
        if (name) {
            this.name = name;
        }
    }

    async add() {
        const result = await Vue.prototype.$axios.post(`/contacts`, {
            name: this.name
        });
        this.id = result.data.data.id;
    }

    save() {
        return Vue.prototype.$axios.patch(`/contacts/${this.id}`, {
            name: this.name
        });
    }

    delete() {
        return Vue.prototype.$axios.delete(`/contacts/${this.id}`);
    }

    populate(contact: ContactItem) {
        if (!contact.id) {
            throw new Error('Invalid ID.');
        }

        this.id = contact.id;
        this.name = contact.name;
        this.entries = contact.entries;
    }

    async deleteEntry(id: number) {
        return Vue.prototype.$axios.delete(`/contact_entries/${id}`).then(() => {
            if (this.entries.length === 1) {
                this.entries.splice(0, this.entries.length);
                return;
            }

            const index = this.entries.map(i => i.id).indexOf(id);
            if (!index) {
                return;
            }

            this.entries.splice(index, 1);
            //this.entries = this.entries.filter(i => i.id !== id);
        });
    }

    async addEntry(entry: ContactEntry) {
        return Vue.prototype.$axios
            .post(`/contact_entries`, {
                // eslint-disable-next-line @typescript-eslint/camelcase
                contact_id: this.id,
                type: entry.type,
                value: entry.value
            })
            .then((result: any) => {
                this.entries.push({
                    id: result.data.data.id,
                    type: entry.type,
                    value: entry.value
                });
            });
    }
}
