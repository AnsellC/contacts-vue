export default {
    name: [(v: string) => v.length > 0 || 'Invalid name.'],
    email: [(v: string) => /.*@.*/gi.test(v) || 'Invalid email.'],
    password: [(v: string) => v.length >= 8 || 'Password must be at least 8 characters.']
};
