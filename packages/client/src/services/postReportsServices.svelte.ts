import {PostReportReason, type PostReportInformations} from "$types/postReportTypes";
import {apiFetch} from "$services/backendServices.svelte";

export async function createPostReport(postId: string, reporterId: string, reason: PostReportReason, description?: string) {
    const response = await apiFetch("/post-reports/register", {
        method: "POST",
        body: JSON.stringify({postId, reporterId, reason, description}),
        checkCredentials: true,
    })

    if(!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}