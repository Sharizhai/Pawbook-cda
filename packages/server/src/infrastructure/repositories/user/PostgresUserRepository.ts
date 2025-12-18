import { User, UserData } from '$domain/entities/Users';
import { UserFilters, IUserRepository } from '$domain/interfaces/repositories/userRepository.interface';
import { PrismaClient } from '@prisma/client';

export class PostgresUserRepository implements IUserRepository {
    constructor(private prisma: PrismaClient) {}

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            include: {
                following: { select: { followingId: true } },
                followers: { select: { followerId: true } },
                posts: { select: { id: true } },
                animals: { select: { id: true } }
            }
        });

        return users.map(user => this.toDomain(user));
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                following: { select: { followingId: true } },
                followers: { select: { followerId: true } },
                posts: { select: { id: true } },
                animals: { select: { id: true } }
            }
        });

        return user ? this.toDomain(user) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                following: { select: { followingId: true } },
                followers: { select: { followerId: true } },
                posts: { select: { id: true } },
                animals: { select: { id: true } }
            }
        });

        return user ? this.toDomain(user) : null;
    }

    async emailExists(email: string, excludeId?: string): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: {
                email,
                ...(excludeId && { id: { not: excludeId } })
            }
        });

        return count > 0;
    }

    async save(user: User): Promise<User> {
        // Upsert = create or update
        const saved = await this.prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                name: user.name,
                firstName: user.firstName,
                email: user.email,
                password: user.password,
                role: user.role,
                profileDescription: user.profileDescription,
                profilePicture: user.profilePicture,
                refreshToken: user.refreshToken,
                createdAt: user.createdAt,
                updatedAt: new Date()
            },
            update: {
                name: user.name,
                firstName: user.firstName,
                email: user.email,
                password: user.password,
                role: user.role,
                profileDescription: user.profileDescription,
                profilePicture: user.profilePicture,
                refreshToken: user.refreshToken,
                updatedAt: new Date()
            },
            include: {
                following: { select: { followingId: true } },
                followers: { select: { followerId: true } },
                posts: { select: { id: true } },
                animals: { select: { id: true } }
            }
        });

        return this.toDomain(saved);
    }

    async update(id: string, updates: Partial<UserData>): Promise<User | null> {
        try {
            // Exclut les champs de relation (gérés par Prisma automatiquement)
            const { posts, animals, follows, followers, ...updateData } = updates;

            const updated = await this.prisma.user.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                include: {
                    following: { select: { followingId: true } },
                    followers: { select: { followerId: true } },
                    posts: { select: { id: true } },
                    animals: { select: { id: true } }
                }
            });

            return this.toDomain(updated);
        } catch (error) {
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.user.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async findFollowers(userId: string): Promise<User[]> {
        const followers = await this.prisma.user.findMany({
            where: {
                following: {
                    some: {
                        followingId: userId
                    }
                }
            },
            include: {
                following: { select: { followingId: true } },
                followers: { select: { followerId: true } },
                posts: { select: { id: true } },
                animals: { select: { id: true } }
            }
        });

        return followers.map(user => this.toDomain(user));
    }

    async findFollowing(userId: string): Promise<User[]> {
        const following = await this.prisma.user.findMany({
            where: {
                followers: {
                    some: {
                        followerId: userId
                    }
                }
            },
            include: {
                following: { select: { followingId: true } },
                followers: { select: { followerId: true } },
                posts: { select: { id: true } },
                animals: { select: { id: true } }
            }
        });

        return following.map(user => this.toDomain(user));
    }

    async searchByName(query: string): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { firstName: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                following: { select: { followingId: true } },
                followers: { select: { followerId: true } },
                posts: { select: { id: true } },
                animals: { select: { id: true } }
            }
        });

        return users.map(user => this.toDomain(user));
    }

    async findByFilters(filters: UserFilters): Promise<User[]> {
        const where: any = {};

        if (filters.name) {
            where.name = { contains: filters.name, mode: 'insensitive' };
        }

        if (filters.firstName) {
            where.firstName = { contains: filters.firstName, mode: 'insensitive' };
        }

        const users = await this.prisma.user.findMany({
            where,
            include: {
                following: { select: { followingId: true } },
                followers: { select: { followerId: true } },
                posts: { select: { id: true } },
                animals: { select: { id: true } }
            }
        });

        return users.map(user => this.toDomain(user));
    }

    async count(): Promise<number> {
        return await this.prisma.user.count();
    }

    /**
     * Convertit un user Prisma en entité User du domaine
     */
    private toDomain(prismaUser: any): User {
        return new User({
            id: prismaUser.id,
            name: prismaUser.name,
            firstName: prismaUser.firstName,
            email: prismaUser.email,
            password: prismaUser.password,
            role: prismaUser.role,
            posts: prismaUser.posts?.map((p: any) => p.id) || [],
            animals: prismaUser.animals?.map((a: any) => a.id) || [],
            follows: prismaUser.following?.map((f: any) => f.followingId) || [],
            followers: prismaUser.followers?.map((f: any) => f.followerId) || [],
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
            profileDescription: prismaUser.profileDescription ?? undefined,
            profilePicture: prismaUser.profilePicture ?? undefined,
            refreshToken: prismaUser.refreshToken ?? undefined
        });
    }
}