import argon2 from "argon2";
import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {isStringNotValid} from "$utils/stringUtils.utils";

export class Argon2Services implements IPasswordServices {
    /**
     * Hash un mot de passe
     */
    async hashPassword(plainPassword: string): Promise<string> {
        if(isStringNotValid(plainPassword)) throw new Error("Password is not valid");

        return await argon2.hash(plainPassword);
    }

    /**
     * Compare un mot de passe en clair avec un hash
     * @param plainPassword - mot de passe brut
     * @param hashedPassword - mot de passe hashé (en base)
     * @returns true si le mot de passe est valide
     */

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        if (!plainPassword || !hashedPassword) {
            return false;
        }

        if (!hashedPassword.startsWith('$argon2')) {
            return false;
        }

        try {
            return await argon2.verify(hashedPassword, plainPassword);
        } catch (error) {
            console.error("Password error:", error);
            return false;
        }
    }
}