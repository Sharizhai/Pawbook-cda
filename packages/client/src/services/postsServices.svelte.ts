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

export async function fetchPostsByAuthorId(page = 1, limit = 10, authorId: string) {
    const response = await apiFetch(`/posts/${authorId}?page=${page}&limit=${limit}`, {
        method: "GET",
        checkCredentials: true,
    });

    if(!response.ok) {
        return { posts: [], hasMore: false, authorId: ""};
    }

    const responseData = await response.json();

    return {
        posts: responseData.data?.posts || [],
        hasMore: responseData.data?.hasMore || false,
        authorId: responseData.data?.authorId || ""
    };
}

export async function createPost(authorId: string, textContent?: string, photoContent?: string[]) {
    const response = await apiFetch("/posts/create", {
        method: "POST",
        body: JSON.stringify({authorId, textContent, photoContent}),
        checkCredentials: true,
    })

    if(!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}