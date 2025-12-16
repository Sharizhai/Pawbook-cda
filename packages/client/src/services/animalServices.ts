import {apiFetch} from "$services/backendServices.svelte";

export async function createAnimal(ownerId: string, name: string, type: string, race?: string, age?: number, picture?: string, description?: string) {
    const response = await apiFetch("/animals/register", {
        method: "POST",
        body: JSON.stringify({ ownerId, name, type, race, age, picture, description }),
        checkCredentials: true,
    })

    if(!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

export async function fetchAnimalsByOwnerId(page = 0, limit = 10, ownerId: string) {
    const response = await apiFetch(`/animals/${ownerId}?page=${page}&limit=${limit}`, {
        method: "GET",
        checkCredentials: true,
    });

    if(!response.ok) {
        return { animals: [], hasMore: false, ownerId: "" };
    }

    const responseData = await response.json();

    return {
        animals: responseData.data?.animals || [],
        hasMore: responseData.data?.hasMore || false,
        ownerId: responseData.data?.ownerId || ""
    };
}