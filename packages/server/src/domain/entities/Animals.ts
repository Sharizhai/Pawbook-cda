/**
 * Entité Animal - Couche Domaine
 * Représente un animal de Pawbook dans le système
 */

import {randomUUID} from "crypto";

export interface AnimalData {
    id: string;
    ownerId: string;
    name: string;
    type: string;
    race?: string;
    age?: number;
    picture?: string;
    description?: string;
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
}

export class Animal {
    public readonly id: string;
    public readonly ownerId: string;
    public readonly name: string;
    public readonly type: string;
    public readonly race?: string;
    public readonly age?: number;
    public readonly picture?: string;
    public readonly description?: string;
    public readonly likes: string[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: AnimalData) {
        this.id = data.id;
        this.ownerId = data.ownerId;
        this.name = data.name;
        this.type = data.type;
        this.race = data.race;
        this.age = data.age;
        this.picture = data.picture;
        this.description = data.description;
        this.likes = data.likes;
    }

    /**
     * Return the number of likes
     */
    getLikesCount(): number {
        return this.likes.length;
    }

    /**
     * Verify if a user has liked this animal
     */
    isLikedBy(userId: string): boolean {
        return this.likes.includes(userId);
    }

    /**
     * Verify if the animal belongs to a specific user
     */
    belongsTo(userId: string): boolean {
        return this.ownerId === userId;
    }

    /**
     * Return public data of the animal
     */
    getPublicData(): Omit<AnimalData, "ownerId"> {
        const { ownerId, ...publicData } = this;
        return publicData;
    }

    /**
     * Create a new Animal instance with default values
     */
    static create(data: Omit<AnimalData, 'id' | 'likes' | 'createdAt' | 'updatedAt'>): Animal {
        return new Animal({
            ...data,
            id: randomUUID(),
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    /**
     * Return profile data for display
     */
    getProfileData(): {
        id: string;
        name: string;
        type: string;
        race?: string;
        age?: number;
        picture?: string;
        description?: string;
        likesCount: number;
        createdAt: Date;
    } {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            race: this.race,
            age: this.age,
            picture: this.picture,
            description: this.description,
            likesCount: this.getLikesCount(),
            createdAt: this.createdAt,
        };
    }

    /**
     * Return a JSON representation of the user (without sensitive information)
     */
    toJSON(): ReturnType<typeof this.getPublicData> {
        return this.getPublicData();
    }

    /**
     * Create a new instance with updated data
     */
    updateWith(updates: Partial<Omit<AnimalData, "id" | "ownerId" | "createdAt">>): Animal {
        return new Animal({
            ...this,
            ...updates,
            updatedAt: new Date()
        });
    }
}