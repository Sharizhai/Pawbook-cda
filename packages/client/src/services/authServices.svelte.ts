import { apiFetch } from "./backendServices.svelte";
import {user} from "$stores/stores.svelte";
import {push} from "svelte-spa-router";

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
    return true;
}

export async function authLogout() {
    user.setAccessToken("");
    user.clearInformations();

    push("/");
}