import { apiFetch } from "$services/backendServices.svelte";
import type {UserInformations} from "$types/userTypes";

export async function uploadProfilePicture(userId: string, file: File) {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await apiFetch(`/photos/${userId}/profile-picture`, {
        method: "POST",
        body: formData,
        checkCredentials: true,
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

    return result.data as UserInformations;
}