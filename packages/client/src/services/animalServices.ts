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