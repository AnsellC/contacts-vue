export function parseError(error: LaravelError) {
    const details: string[] = [];
    const keys = Object.keys(error.errors);
    keys.forEach(i => {
        details.push(...error.errors[i]);
    });

    return {
        message: error.message,
        details: details
    };
}
