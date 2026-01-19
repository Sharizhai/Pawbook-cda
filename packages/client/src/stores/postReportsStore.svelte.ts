import type {PostReportInformations} from "$types/postReportTypes";
import type {PostInformations} from "$types/postTypes";

export function createPostReportsSlice() {
    let postReports: PostReportInformations[] = $state([]);
    let information: PostReportInformations = $state( {} as PostReportInformations);

    let hasMore = $state(true);
    let currentPage = $state(1);

    function setPostReports(newPostReports: PostReportInformations[]) {
        postReports = newPostReports;
    }

    function setHasMore(value: boolean) {
        hasMore = value;
    }

    function setCurrentPage(value: number) {
        currentPage = value;
    }

    return {
        get postReports() {
            return postReports;
        },
        get information() {
            return information;
        },
        get hasMore() {
            return hasMore;
        },
        get currentPage() {
            return currentPage;
        },
        setPostReports,
        setHasMore,
        setCurrentPage,
    }
}