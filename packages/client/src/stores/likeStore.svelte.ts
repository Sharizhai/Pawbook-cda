import type {postLikeInformations} from "$types/likeTypes";

export function createLikeSlice() {
    let likes: postLikeInformations[] = $state([]);

    function isLikingPost(postId: string): boolean {
        if (!postId) return false;

        return likes.some(like => like.postId === postId);
    }

    function setLikes(newLikes: postLikeInformations[]) {
        likes = Array.isArray(newLikes) ? newLikes : [];
        likes = newLikes;
    }

    function addLike(like: postLikeInformations) {
        likes = [...likes, like];
    }

    function removeLike(postId: string) {
        likes = likes.filter(like => like.postId !== postId);
    }

    return {
        get likes() {
            return likes;
        },
        isLikingPost,
        setLikes,
        addLike,
        removeLike,
    }
}