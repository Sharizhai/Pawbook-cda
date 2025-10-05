import type {PostInformations} from "$types/postTypes";
import {apiFetch} from "$services/backendServices.svelte";

export async function fetchAllPosts(page = 1, limit = 10): Promise<{ posts: PostInformations[], hasMore: boolean }> {
    const response = await apiFetch(`/posts?page=${page}&limit=${limit}`, {
        method: "GET",
        checkCredentials: true,
    });

    if (!response.ok) return { posts: [], hasMore: false };

    const responseData = await response.json();

    return {
        posts: responseData.data?.posts || [],
        hasMore: responseData.data?.hasMore || false
    };
}