export interface IPasswordServices {
    /**
     * Hash password
     */
    hashPassword(password: string): Promise<string>;

    /**
     * Verify password with hash
     */
    verifyPassword(password: string, hash: string): Promise<boolean>;
}