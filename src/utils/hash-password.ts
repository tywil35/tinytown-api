import crypto from 'crypto';
import { EnvUtil } from './env.util';

/**
 * HashPasswordUtil
 * dependencies:
 *      - crypto
 *      - EnvUtil
 */
export type HashedPassword = {
    hash: string,
    salt: string
};
export namespace HashPasswordUtil {

    export const GenerateRandomPassword = (size: number = 16): string => {
        return crypto.randomBytes(size).toString('hex');
    }
    /**
     * Hash plain text password
     * Optional setting `process.env.HASH_PASSWORD_SALT_COUNT ` 
     * @param password plain text of password to hash
     * @returns hashed version of password
     */
    export const HashPassword = async (password: string): Promise<HashedPassword> => {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, +EnvUtil.HASH_PSSWRD_ITERATIONS, +EnvUtil.HASH_PSSWRD_KEYLEN, EnvUtil.HASH_PSSWRD_DIGEST).toString(`hex`);
        return { hash, salt };
    };

    /**
     * Compare hash to plain text password
     * @param password plain text of password
     * @param hash hashed value of password
     * @returns true if they match
     */
    export const CompareHashedPassword = async (password: string, hashedPassword: HashedPassword): Promise<boolean> => {
        const _password_hash = crypto.pbkdf2Sync(password,
            hashedPassword.salt, +EnvUtil.HASH_PSSWRD_ITERATIONS, +EnvUtil.HASH_PSSWRD_KEYLEN, EnvUtil.HASH_PSSWRD_DIGEST).toString(`hex`);
        return _password_hash === hashedPassword.hash;
    };
}


