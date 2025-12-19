import type {FollowInformations} from "$types/followTypes";

export function createFollowSlice() {
    let information: FollowInformations = $state({} as FollowInformations);

    let followers: FollowInformations[] = $state([]);
    let following: FollowInformations[] = $state([]);

    let followerCount = $derived(followers.length);
    let followingCount = $derived(following.length);

    let isSelfFollow = $derived(information.followerId === information.followingId);

    let isReciprocal = $derived(
        followers.some(f => f.followerId === information.followingId) &&
        following.some(f => f.followingId === information.followingId)
    );

    function isFollowing(followingUserId: string): boolean {
        return following.some(f => f.followingId === followingUserId);
    }

    return {
        get information() {
            return information;
        },
        get isSelfFollow() {
            return isSelfFollow;
        },
        get isReciprocal() {
            return isReciprocal;
        },

        isFollowing,
    }
}