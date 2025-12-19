import {apiFetch} from "$services/backendServices.svelte";

export async function createFollow(followerId: string, followingId: string) {
    const response = await apiFetch("/follows/register", {
        method: "POST",
        body: JSON.stringify({ followerId, followingId }),
        checkCredentials: true
    })

    if(!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}