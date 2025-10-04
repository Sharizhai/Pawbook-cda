import type {PostInformations} from "$types/postTypes";
import {post} from "$stores/stores.svelte";

export function createPostSlice() {
    let posts: PostInformations[] = $state([]);
    let information: PostInformations = $state( {} as PostInformations);

    let isUpdated = $derived(post.information.updated);

    return {
        get posts() {
            return posts;
        },
        get information() {
            return information;
        },
        get isUpdated() {
            return isUpdated;
        },
    }
}