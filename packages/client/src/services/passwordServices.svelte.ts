import {apiFetch} from "$services/backendServices.svelte";

export async function updatePassword(currentPassword: string, newPassword: string) {
    const response = await apiFetch("/users/update-password", {
        method: "PATCH",
        body: JSON.stringify({currentPassword, newPassword}),
    })

    if(!response.ok) {
        const error = await response.json();
        throw error;
    }

    return await response.json();
}