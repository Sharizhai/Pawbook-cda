import argon2 from 'argon2';

export class Argon2Services {
    /**
     * Hash un mot de passe
     */
    async hashPassword(plainPassword: string): Promise<string> {
        return await argon2.hash(plainPassword);
    }

    /**
     * Compare un mot de passe en clair avec un hash
     * @param plainPassword - mot de passe brut
     * @param hashedPassword - mot de passe hashé (en base)
     * @returns true si le mot de passe est valide
     */

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await argon2.verify(hashedPassword, plainPassword);
    }
}