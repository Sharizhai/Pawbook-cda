export function isMail(value: string) {
    return(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).test(value);
}

export function isStringNotValid(value: string) {
    return !value || value.trim() === "";
}