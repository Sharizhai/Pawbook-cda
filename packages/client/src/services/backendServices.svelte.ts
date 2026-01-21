import type { APIFetchRequestInit } from '$types/backendTypes';
import {authLogout, authRefresh} from '$services/authServices.svelte.js';
import { isTokenExpired } from '$utils/tokenUtils';
import { user } from '$stores/stores.svelte';

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

    if (!headers.has('Content-Type') && !(init?.body instanceof FormData))
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
    const refreshToken = $state.snapshot(user.refreshToken);

    if (accessToken && !isTokenExpired(accessToken)) return true;

    if (refreshToken && !isTokenExpired(refreshToken)) {
        await authRefresh(refreshToken);
        return !user.isAccessTokenExpired;
    }

    return false;
}
