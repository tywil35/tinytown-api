import dotenv from 'dotenv';

export namespace EnvUtil {
    dotenv.config();
    declare const process: {
        env: {
            API_NAME: string,
            ENV_MODE: string,
            HASH_PASSWORD_SALT_COUNT: string,
            JWT_SECRET: string,
            JWT_EXPIRE_TIME: string,
            MYSQL_MIGRATION: string,
            MYSQL_DB_NAME: string,
            MYSQL_DB_USER: string,
            MYSQL_HOST: string,
            MYSQL_HOST_PORT: number,
            MYSQL_POOL_CONNECT_LIMIT: number,
            MYSQL_POOL_CONNECT_TIMEOUT: number,
            MYSQL_SSL: string,
            MYSQL_TIMEZONE: string,
            MYSQL_USER_PASSWORD: string,
            REGION: string,
            SERVER_PORT: string,
            VERSION: string,
            CORS_ORIGIN: string | string[],
            REDIS_URL: string,
            APP_DOMAIN_URL: string,
            HASH_PSSWRD_ITERATIONS: number,
            HASH_PSSWRD_KEYLEN: number,
            HASH_PSSWRD_DIGEST: string,
            MAILER_TEMPLATES_PATH: string,
            MAILER_SERVICE: string,
            MAILER_USER: string,
            MAILER_PSWRD: string,
            MAILER_SECURE: boolean,
            MAILER_PORT: number,
            MAILER_HOST: string,
            MAILER_FORGOT_PASSWORD_LINK: string
        }
    }
    export const API_NAME = process.env.API_NAME;
    export const ENV_MODE = process.env.ENV_MODE;
    export const HASH_PASSWORD_SALT_COUNT = process.env.HASH_PASSWORD_SALT_COUNT;
    export const JWT_SECRET = process.env.JWT_SECRET;
    export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
    export const MYSQL_MIGRATION = process.env.MYSQL_MIGRATION;
    export const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME;
    export const MYSQL_DB_USER = process.env.MYSQL_DB_USER;
    export const MYSQL_HOST = process.env.MYSQL_HOST;
    export const MYSQL_HOST_PORT: number = process.env.MYSQL_HOST_PORT;
    export const MYSQL_POOL_CONNECT_LIMIT: number = process.env.MYSQL_POOL_CONNECT_LIMIT;
    export const MYSQL_POOL_CONNECT_TIMEOUT: number = process.env.MYSQL_POOL_CONNECT_TIMEOUT;
    export const MYSQL_SSL = process.env.MYSQL_SSL;
    export const MYSQL_TIMEZONE = process.env.MYSQL_TIMEZONE;
    export const MYSQL_USER_PASSWORD = process.env.MYSQL_USER_PASSWORD;
    export const REGION = process.env.REGION;
    export const SERVER_PORT = process.env.SERVER_PORT;
    export const VERSION = process.env.VERSION;
    export const CORS_ORIGIN = process.env.CORS_ORIGIN;
    export const APP_DOMAIN_URL = process.env.APP_DOMAIN_URL;
    export const HASH_PSSWRD_ITERATIONS: number = process.env.HASH_PSSWRD_ITERATIONS;
    export const HASH_PSSWRD_KEYLEN: number = process.env.HASH_PSSWRD_KEYLEN;
    export const HASH_PSSWRD_DIGEST = process.env.HASH_PSSWRD_DIGEST;
    export const MAILER_TEMPLATES_PATH = process.env.MAILER_TEMPLATES_PATH;
    export const MAILER_SERVICE = process.env.MAILER_SERVICE;
    export const MAILER_USER = process.env.MAILER_USER;
    export const MAILER_PSWRD = process.env.MAILER_PSWRD;
    export const MAILER_SECURE = process.env.MAILER_SECURE;
    export const MAILER_PORT: number = process.env.MAILER_PORT;
    export const MAILER_HOST = process.env.MAILER_HOST;
    export const MAILER_FORGOT_PASSWORD_LINK = process.env.MAILER_FORGOT_PASSWORD_LINK;
}
