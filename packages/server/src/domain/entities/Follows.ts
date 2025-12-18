/**
 * Entité Follow - Couche Domaine
 * Représente un follow de Pawbook dans le système
 */

import {randomUUID} from "crypto";

export interface FollowData {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: Date;
}

export class Follow {
    public readonly id: string;
    public readonly followerId: string;
    public readonly followingId: string;
    public readonly createdAt: Date;

    constructor(data: FollowData) {
        this.id = data.id;
        this.followerId = data.followerId;
        this.followingId = data.followingId;
        this.createdAt = data.createdAt;
    }

    static create(followerId: string, followingId: string): Follow {
        return new Follow({
            id: randomUUID(),
            followerId,
            followingId,
            createdAt: new Date(),
        });
    }

    /**
     * Check if the follow is reciprocal with another follow
     * @param other The other follow to check against
     * @returns true if the followerId and followingId are the same as the other follow's, false otherwise'
     */
    isReciprocal(other: Follow): boolean {
        return (
            this.followerId === other.followingId &&
            this.followingId === other.followerId
        );
    }

    /**
     * Verify if the user tries to follow himself
     * @returns true if the followerId is the same as the followingId, false otherwise
     */
    isSelfFollow(): boolean {
        return this.followerId === this.followingId;
    }

    /**
     * Retourne les données publiques du follow
     */
    getPublicData(): FollowData {
        return { ...this };
    }

    /**
     * Return a JSON representation of the follow (without sensitive information)
     */
    toJSON(): ReturnType<typeof this.getPublicData> {
        return this.getPublicData();
    }
}