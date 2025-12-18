import {IFollowRepository} from "$domain/interfaces/repositories/followRepository.interface";
import {Follow} from "$domain/entities/Follows";
import {PrismaClient} from "@prisma/client";

export class PostgresFollowRepository implements IFollowRepository {
    constructor(private prisma: PrismaClient) {}

    async findById(id: string): Promise<Follow | null> {
        const follow = await this.prisma.follow.findUnique({
            where: { id },
        })

        return follow ? this.toDomain(follow) : null;
    }

    async findByUsers(followerId: string, followingId: string): Promise<Follow | null> {
        const follow = await this.prisma.follow.findFirst({
            where: {
                followerId,
                followingId,
            },
        });

        return follow ? this.toDomain(follow) : null;
    }

    async findByFollowerId(followerId: string): Promise<Follow[]> {
        const follows = await this.prisma.follow.findMany({
            where: { followerId },
        });

        return follows.map(follow => this.toDomain(follow));
    }

    async findByFollowingId(followingId: string): Promise<Follow[]> {
        const follows = await this.prisma.follow.findMany({
            where: { followingId },
        });

        return follows.map(follow => this.toDomain(follow));
    }

    async exists(followerId: string, followingId: string): Promise<boolean> {
        const count = await this.prisma.follow.count({
            where: {
                followerId,
                followingId,
            },
        });

        return count > 0;
    }

    async areMutualFollowers(userId1: string, userId2: string): Promise<boolean> {
        const count = await this.prisma.follow.count({
            where: {
                OR: [
                    { followerId: userId1, followingId: userId2 },
                    { followerId: userId2, followingId: userId1 },
                ],
            },
        });

        return count === 2;
    }

    async findMutualFollowers(userId1: string, userId2: string): Promise<Follow[]> {
        const followersOfUser1 = await this.prisma.follow.findMany({
            where: { followingId: userId1 },
            select: { followerId: true },
        });

        const followerIds1 = followersOfUser1.map(f => f.followerId);

        const mutualFollows = await this.prisma.follow.findMany({
            where: {
                followingId: userId2,
                followerId: {
                    in: followerIds1,
                },
            },
        });

        return mutualFollows.map(f => this.toDomain(f));
    }

    async save(follow: Follow): Promise<Follow> {
        // Upsert = create or update
        const saved = await this.prisma.follow.upsert({
            where: { id: follow.id },
            create: {
                id: follow.id,
                followerId: follow.followerId,
                followingId: follow.followingId,
                createdAt: follow.createdAt,
            },
            update: {
                followerId: follow.followerId,
                followingId: follow.followingId,
            },
        });

        return this.toDomain(saved);
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.follow.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteByUsers(followerId: string, followingId: string): Promise<boolean> {
        try {
            const result = await this.prisma.follow.deleteMany({
                where: {
                    followerId,
                    followingId,
                },
            });
            return result.count > 0;
        } catch (error) {
            return false;
        }
    }

    async count(): Promise<number> {
        return await this.prisma.follow.count();
    }

    async countFollowers(userId: string): Promise<number> {
        return await this.prisma.follow.count({
            where: { followingId: userId },
        });
    }

    async countFollowing(userId: string): Promise<number> {
        return await this.prisma.follow.count({
            where: { followerId: userId },
        });
    }

    /**
     * Convertit un follow Prisma en entité Follow du domaine
     */
    private toDomain(prismaFollow: any): Follow {
        return new Follow({
            id: prismaFollow.id,
            followerId: prismaFollow.followerId,
            followingId: prismaFollow.followingId,
            createdAt: prismaFollow.createdAt
        });
    }
}