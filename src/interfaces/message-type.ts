interface MessageType {
    type: 'error' | 'success' | 'info' | undefined;
    text: string | null;
    errors?: string[];
    isSnack?: boolean;
}
