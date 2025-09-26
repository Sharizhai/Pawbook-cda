/**
 * Entité User - Couche Domaine
 * Représente un membre de Pawbook dans le système
 */
import {IMongoUserDocument} from "$types/mongo";

export interface UserData {
    id: string;
    name: string;
    firstName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN" | "MODERATOR";
    posts: string[];
    animals: string[];
    follows: string[];
    followers: string[];
    createdAt: Date;
    updatedAt: Date;
    profileDescription?: string;
    profilePicture?: string;
    refreshToken?: string;
}

export class User {
    public readonly id: string;
    public readonly name: string;
    public readonly firstName: string;
    public readonly email: string;
    public readonly password: string;
    public readonly role: "USER" | "ADMIN" | "MODERATOR";
    public readonly posts: string[];
    public readonly animals: string[];
    public readonly follows: string[];
    public readonly followers: string[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly profileDescription?: string;
    public readonly profilePicture?: string;
    public readonly refreshToken?: string;

    constructor(data: UserData) {
        this.id = data.id;
        this.name = data.name;
        this.firstName = data.firstName;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
        this.posts = [...data.posts];
        this.animals = [...data.animals];
        this.follows = [...data.follows];
        this.followers = [...data.followers];
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.profileDescription = data.profileDescription;
        this.profilePicture = data.profilePicture;
        this.refreshToken = data.refreshToken;
    }

    /**
     * Return full name of the user
     */
    getFullName(): string {
        return `${this.firstName} ${this.name}`;
    }

    /**
     * Return true if the user is admin
     */
    isAdmin(): boolean {
        return this.role === "ADMIN";
    }

    /**
     * Return true if the user is moderator or admin
     */
    isModerator(): boolean {
        return this.role === "MODERATOR" || this.role === "ADMIN";
    }

    /**
     * Return true if the user can moderate content
     */
    canModerate(): boolean {
        return this.isModerator();
    }

    /**
     * verify if the user can modify another user
     */
    canModifyUser(targetUserId: string): boolean {
        return this.id === targetUserId || this.isAdmin();
    }

    /**
     * verify if the user can delete a post
     */
    canDeletePost(postAuthorId: string): boolean {
        return this.id === postAuthorId || this.canModerate();
    }

    /**
     * Return the number of animals owned by the user
     */
    getAnimalsCount(): number {
        return this.animals.length;
    }

    /**
     * Return the number of posts by the user
     */
    getPostsCount(): number {
        return this.posts.length;
    }

    /**
     * Return the number of followers
     */
    getFollowersCount(): number {
        return this.followers.length;
    }

    /**
     * Return the number of people followed
     */
    getFollowingCount(): number {
        return this.follows.length;
    }

    /**
     * Verify if the user follows another user
     */
    isFollowing(memberId: string): boolean {
        return this.follows.includes(memberId);
    }

    /**
     * Verify if a member follows this member
     */
    isFollowedBy(memberId: string): boolean {
        return this.followers.includes(memberId);
    }

    /**
     * Verify if the user owns a specific animal
     */
    ownsAnimal(animalId: string): boolean {
        return this.animals.includes(animalId);
    }

    /**
     * Verify if the user has created a specific post
     */
    hasCreatedPost(postId: string): boolean {
        return this.posts.includes(postId);
    }

    /**
     * Calculate the age of the account in days
     */
    getUsershipDuration(): number {
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - this.createdAt.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Return public data of the user (without sensitive information)
     */
    getPublicData(): Omit<UserData, "password" | "refreshToken" | "email"> {
        const { password, refreshToken, email, ...publicData } = this;
        return publicData;
    }

    /**
     * Return public data of the user (without sensitive information)
     */
    getProfileData(): {
        id: string;
        firstName: string;
        name: string;
        profileDescription?: string;
        profilePicture?: string;
        animalsCount: number;
        postsCount: number;
        followersCount: number;
        followingCount: number;
        memberSince: Date;
    } {
        return {
            id: this.id,
            firstName: this.firstName,
            name: this.name,
            profileDescription: this.profileDescription,
            profilePicture: this.profilePicture,
            animalsCount: this.getAnimalsCount(),
            postsCount: this.getPostsCount(),
            followersCount: this.getFollowersCount(),
            followingCount: this.getFollowingCount(),
            memberSince: this.createdAt,
        };
    }

    /**
     * Return a JSON representation of the user (without sensitive information)
     */
    toJSON(): ReturnType<typeof this.getPublicData> {
        return this.getPublicData();
    }

    /**
     * Create a User instance from a MongoDB document
     * Used to convert MongoDB data into domain entities
     *
     */
    static fromMongoDocument(doc: IMongoUserDocument): User {
        return new User({
            id: doc._id.toString(),
            name: doc.name,
            firstName: doc.firstName,
            email: doc.email,
            password: doc.password,
            role: doc.role,
            posts: doc.posts?.map((p: any) => p.toString()) || [],
            animals: doc.animals?.map((a: any) => a.toString()) || [],
            follows: doc.follows?.map((f: any) => f.toString()) || [],
            followers: doc.followers?.map((f: any) => f.toString()) || [],
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            profileDescription: doc.profileDescription,
            profilePicture: doc.profilePicture,
            refreshToken: doc.refreshToken
        });
    }

    /**
     * Create a new instance with updated data
     */
    updateWith(updates: Partial<Omit<UserData, "id" | "createdAt">>): User {
        return new User({
            ...this,
            ...updates,
            updatedAt: new Date()
        });
    }
}