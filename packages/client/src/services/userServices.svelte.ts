import type {UserInformations} from "$types/userTypes";
import {apiFetch} from "$services/backendServices.svelte";

export async function fetchUserInformations(): Promise<UserInformations> {
    const response = await apiFetch("/auth/me");

    if(!response.ok) return {};

    const responseData = await response.json();

    return responseData.data || {};
}