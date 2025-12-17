import type {PublicUserInformations, UserInformations} from "$types/userTypes";
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

export async function createUser(name: string, firstName:string, email: string, password: string, profilePicture: string, profileDescription: string) {
    const response = await apiFetch("/users/register", {
        method: "POST",
        body: JSON.stringify({ name, firstName, email, password, profilePicture, profileDescription }),
        checkCredentials: false,
    })

    if(!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

export async function getUserInformations(userId: string): Promise<PublicUserInformations> {
    const response = await apiFetch(`/users/${userId}`, {
        method: "GET",
        checkCredentials: true,
    });

    if(!response.ok)
        throw new Error("Unable to fetch user profile");

    const responseData = await response.json();

    return responseData.data || {} as PublicUserInformations;
}