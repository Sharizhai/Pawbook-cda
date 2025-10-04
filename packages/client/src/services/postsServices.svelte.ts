import type {PostInformations} from "$types/postTypes";
import {apiFetch} from "$services/backendServices.svelte";

export async function fetchAllPosts(skip = 0, limit = 10): Promise<PostInformations[]> {
    const response = await apiFetch(`/posts?skip=${skip}&limit=${limit}`, {
        method: "GET",
        checkCredentials: true,
    });

    if (!response.ok) return [];

    const responseData = await response.json();

    return responseData.data || [];
}