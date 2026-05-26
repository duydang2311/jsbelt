export function guard(condition: any, message: string): asserts condition {
    if (!condition) {
        throw new Error(`Guard failed: ${message}`);
    }
}

export function guardNull(condition: any, name?: string): asserts condition {
    if (!condition) {
        throw new Error(`Guard failed: ${name ?? 'value'} must not be null`);
    }
}
