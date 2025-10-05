import type {PostInformations} from "$types/postTypes";
import {post} from "$stores/stores.svelte";

export function createPostSlice() {
    let posts: PostInformations[] = $state([]);
    let information: PostInformations = $state( {} as PostInformations);

    let hasMore = $state(true);
    let currentPage = $state(1);
    let isLoading = $state(false);

    let isUpdated = $derived(post.information.updated);

    function setPosts(newPosts: PostInformations[]) {
        posts = newPosts;
    }

    function addPosts(newPosts: PostInformations[]) {
        posts = [...posts, ...newPosts];
    }

    function setHasMore(value: boolean) {
        hasMore = value;
    }

    function setCurrentPage(value: number) {
        currentPage = value;
    }

    return {
        get posts() {
            return posts;
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
        get isUpdated() {
            return isUpdated;
        },

        setPosts,
        addPosts,
        setHasMore,
        setCurrentPage,
    }
}