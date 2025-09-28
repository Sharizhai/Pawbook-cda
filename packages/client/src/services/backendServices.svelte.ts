import { authLogout } from '$services/authServices.svelte.js';
import { user } from '$stores/stores.svelte';
import type { APIFetchRequestInit } from '$types/backendTypes';
import { isTokenExpired } from '$utils/tokenUtils';

export const backendURL = `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api`;

export async function apiFetch(
    url: string,
    init?: APIFetchRequestInit,
): Promise<Response> {
    const headers = init?.headers ?? new Headers();

    if (init?.checkCredentials ?? true) {
        if (!(await validateUserCredentials())) {
            await authLogout();

            return Promise.reject(new Error('Invalid credentials'));
        }

        const accessToken = user.accessToken;
        headers.append('Authorization', `Bearer ${accessToken}`);
    }

    if (!headers.has('Content-Type'))
        headers.append('Content-Type', 'application/json');

    try {
        const response = await fetch(`${backendURL}${url}`, {
            method: init?.method ?? 'GET',
            body: init?.body ?? null,
            headers,
            credentials: 'include',
            signal: init?.controller?.signal ?? null,
        });

        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function validateUserCredentials(): Promise<boolean> {
    const accessToken = $state.snapshot(user.accessToken);

    if (accessToken && !isTokenExpired(accessToken)) return true;

    return false;
}
