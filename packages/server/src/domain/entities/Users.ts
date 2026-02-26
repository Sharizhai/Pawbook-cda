/**
 * Entité User - Couche Domaine
 * Représente un membre de Pawbook dans le système
 */
import {IMongoUserDocument} from "$types/mongo";
import {randomUUID} from "crypto";

export interface UserData {
    id: string;
    name: string;
    firstName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN" | "MODERATOR";
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

    static create(data: Omit<UserData, 'id' | 'createdAt' | 'updatedAt' | 'refreshToken'>): User {
        return new User({
            ...data,
            id: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            refreshToken: "",
        });
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
        memberSince: Date;
    } {
        return {
            id: this.id,
            firstName: this.firstName,
            name: this.name,
            profileDescription: this.profileDescription,
            profilePicture: this.profilePicture,
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