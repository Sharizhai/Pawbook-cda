import {IFollowRepository} from "$domain/interfaces/repositories/followRepository.interface";
import {Follow} from "$domain/entities/Follows";

export class InMemoryFollowRepository implements IFollowRepository {
    private follows: Follow[] = [];

    findById(id: string): Promise<Follow | null> {
        return Promise.resolve(this.follows.find(follow => follow.id === id) || null);
    }

    findByUsers(followerId: string, followingId: string): Promise<Follow | null> {
        return Promise.resolve(this.follows.find(follow => follow.followerId === followerId && follow.followingId === followingId) || null);
    }

    findByFollowerId(followerId: string): Promise<Follow[]> {
        return Promise.resolve(this.follows.filter(follow => follow.followerId === followerId));
    }

    findByFollowingId(followingId: string): Promise<Follow[]> {
        return Promise.resolve(this.follows.filter(follow => follow.followingId === followingId));
    }

    exists(followerId: string, followingId: string): Promise<boolean> {
        const follow = this.follows.find(follow => follow.followerId === followerId && follow.followingId === followingId);
        return Promise.resolve(!!follow);
    }

    areMutualFollowers(userId1: string, userId2: string): Promise<boolean> {
        const user1FollowsUser2 = this.follows.some(follow => follow.followerId === userId1 && follow.followingId === userId2);
        const user2FollowsUser1 = this.follows.some(follow => follow.followerId === userId2 && follow.followingId === userId1);

        return Promise.resolve(user1FollowsUser2 && user2FollowsUser1);
    }

    findMutualFollowers(userId1: string, userId2: string): Promise<Follow[]> {
        const followersOfUser1 = this.follows
            .filter(follow => follow.followingId === userId1)
            .map(follow => follow.followerId);

        const followersOfUser2 = this.follows
            .filter(follow => follow.followingId === userId2)
            .map(follow => follow.followerId);

        const mutualFollowerIds = followersOfUser1.filter(followerId => followersOfUser2.includes(followerId));
        const mutualFollows = this.follows.filter(f => f.followingId === userId1 && mutualFollowerIds.includes(f.followerId));

        return Promise.resolve(mutualFollows);
    }

    async save(follow: Follow): Promise<Follow> {
        const index = this.follows.findIndex(f => f.id === follow.id);

        if (index !== -1) {
            this.follows[index] = follow;
        } else {
            this.follows.push(follow);
        }

        return follow;
    }

    delete(id: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    deleteByUsers(followerId: string, followingId: string): Promise<boolean> {
        const index = this.follows.findIndex(follow => follow.followerId === followerId && follow.followingId === followingId);

        if (index === -1) return Promise.resolve(false);

        this.follows.splice(index, 1);

        return Promise.resolve(true);
    }

    count(): Promise<number> {
        return Promise.resolve(this.follows.length);
    }

    countFollowers(userId: string): Promise<number> {
        return Promise.resolve(this.follows.filter(follow => follow.followingId === userId).length);
    }

    countFollowing(userId: string): Promise<number> {
        return Promise.resolve(this.follows.filter(follow => follow.followerId === userId).length);
    }
}