import {apiFetch} from "$services/backendServices.svelte";
import {follow} from "$stores/stores.svelte";

export async function createFollow(followerId: string, followingId: string) {
    const response = await apiFetch("/follows/register", {
        method: "POST",
        body: JSON.stringify({ followerId, followingId }),
        checkCredentials: true
    })

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }

    follow.addFollowing(result.data);

    return result;
}

export async function deleteFollow(followingId: string) {
    const response = await apiFetch(`/follows/${followingId}`, {
        method: "DELETE",
        checkCredentials: true
    });

    if (response.ok) {
        follow.removeFollowing(followingId);
    }
}