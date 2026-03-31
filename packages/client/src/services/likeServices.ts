import {apiFetch} from "$services/backendServices.svelte";
import {like} from "$stores/stores.svelte";

export async function createLike(postId: string) {
    const response = await apiFetch(`/likes/${postId}`, {
        method: "POST",
        checkCredentials: true
    })

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }

    like.addLike(result.data);

    return result;
}

export async function deleteLike(postId: string) {
    const response = await apiFetch(`/likes/${postId}`, {
        method: "DELETE",
        checkCredentials: true
    });

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    like.removeLike(postId);
}

export async function fetchAllpostLikesByAuthorId() {
    const response = await apiFetch(`/likes`, {
        method: "GET",
        checkCredentials: true
    });

    if(!response.ok) {
        return [];
    }

    const result = await response.json();
    return result.data;
}