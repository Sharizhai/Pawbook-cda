import { apiFetch } from "./backendServices.svelte";
import {user} from "$stores/stores.svelte";

export async function authLogin(email: string, password: string) {
    const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        checkCredentials: false,
    })

    const result = await response.json();

    if(!response.ok) {
        console.error(result.errorCode);

        if (result.errors) {
            throw new Error(result.errors.map((err: any) => err.message).join(', '));
        }

        throw new Error(result.message || 'Erreur de connexion');
    }

    user.setAccessToken(result.data.token);
    user.setRefreshToken(result.data.refreshToken);
    return true;
}

export async function authRefresh(refreshToken: string) {
    const response = await apiFetch("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        checkCredentials: false,
    });

    if(!response.ok) return;

    const result = await response.json();

    if(!result.data.token) return;

    user.setAccessToken(result.data.token);
}

export async function authLogout() {
    await apiFetch("/auth/logout", {
        method: "POST",
        checkCredentials: true,
    })

    user.setAccessToken("");
    user.setRefreshToken("");
    user.clearInformations();
}