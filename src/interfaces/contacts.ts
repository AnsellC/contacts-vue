interface ContactEntry {
    id?: number;
    type: 'email' | 'phone';
    value: string;
}

interface ContactItem {
    id?: number;
    name: string;
    entries: ContactEntry[];
}
