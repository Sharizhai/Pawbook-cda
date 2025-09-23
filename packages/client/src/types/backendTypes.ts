export type APIFetchRequestInit = {
    "method"?: string;
    "headers"?: Headers;
    "body"?: BodyInit | null;
    "checkCredentials"?: boolean;
    "controller"?: AbortController | null
}