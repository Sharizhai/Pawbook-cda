import type {PostReportInformations} from "$types/postReportTypes";
import {apiFetch} from "$services/backendServices.svelte";

export async function fetchAllPostReports(page = 1, limit = 10): Promise<{ postReports: PostReportInformations[], hasMore: boolean }> {
    const response = await apiFetch(`/post-reports?page=${page}&limit=${limit}`, {
        method: "GET",
        checkCredentials: true,
    });

    if (!response.ok) return { postReports: [], hasMore: false };

    const responseData = await response.json();

    return {
        postReports: responseData.data?.postReports || [],
        hasMore: responseData.data?.hasMore || false
    };
}