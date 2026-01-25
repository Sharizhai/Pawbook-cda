export function isStringNotValid(value: string) {
    return !value || value.trim() === "";
}

export function sanitizeString(value: string) {
    return value.replace(/<\/?[^>]+(>|$)/g, "")
}