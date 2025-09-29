import type {UserInformations} from "$types/userTypes";
import {apiFetch} from "$services/backendServices.svelte";

export async function fetchUserInformations(): Promise<UserInformations> {
    const response = await apiFetch("/auth/me",{
        method: "GET",
        checkCredentials: true,
    });

    if(!response.ok) return {} as UserInformations;

    const responseData = await response.json();

    return responseData.data || {} as UserInformations;
}