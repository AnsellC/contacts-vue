interface LaravelError {
    message: string;
    errors: {
        [index: string]: string[];
    };
}
