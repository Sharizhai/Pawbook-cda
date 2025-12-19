import type {FollowInformations} from "$types/followTypes";

export function createFollowSlice() {
    let information: FollowInformations = $state({} as FollowInformations);

    let followers: FollowInformations[] = $state([]);
    let following: FollowInformations[] = $state([]);

    let isSelfFollow = $derived(information.followerId === information.followingId);

    let isReciprocal = $derived(
        followers.some(f => f.followerId === information.followingId) &&
        following.some(f => f.followingId === information.followingId)
    );

    function isFollowing(followingUserId: string): boolean {
        if (!followingUserId) return false;
        return following.some(f => f.followingId === followingUserId);
    }

    function setFollowing(newFollowing: FollowInformations[]) {
        following = newFollowing;
    }

    function setFollowers(newFollowers: FollowInformations[]) {
        followers = newFollowers;
    }

    function addFollowing(follow: FollowInformations) {
        following = [...following, follow];
    }

    function removeFollowing(followingUserId: string) {
        following = following.filter(f => f.followingId !== followingUserId);
    }

    return {
        get information() {
            return information;
        },
        get following() {
            return following;
        },
        get followers() {
            return followers;
        },
        get isSelfFollow() {
            return isSelfFollow;
        },
        get isReciprocal() {
            return isReciprocal;
        },

        isFollowing,
        setFollowing,
        setFollowers,
        addFollowing,
        removeFollowing,
    }
}