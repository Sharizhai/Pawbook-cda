import {apiFetch} from "$services/backendServices.svelte";

export async function searchUserOrPet(searchTerm: string) {
    const response = await apiFetch(`/search?searchTerm=${searchTerm}`);

    if(!response.ok) {
        const error = await response.json();
        throw error;
    }

    const results = await response.json();
    return results.data;
}