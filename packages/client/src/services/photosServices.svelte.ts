import { backendURL } from "$services/backendServices.svelte";

export async function uploadProfilePicture(userId: string, file: File) {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(`${backendURL}/photos/${userId}/profile-picture`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    if (!response.ok) {
        let error: any;
        try {
            error = await response.json();
        } catch {
            error = { message: `Upload failed with status ${response.status}` };
        }
        throw error;
    }

    const result = await response.json();
    return result.data;
}