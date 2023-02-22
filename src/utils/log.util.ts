import { EnvUtil } from "./env.util";

export namespace LogUtil {
    const isDev = EnvUtil.ENV_MODE !== 'prod';
    export const info = (message?: any, ...optionalParams: any[]) => {
        if (isDev) {
            console.info(message, ...optionalParams);
        }
    };
    export const debug = (message?: any, ...optionalParams: any[]) => {
        if (isDev) {
            console.debug(message, ...optionalParams);
        }
    };
    export const error = (message?: any, ...optionalParams: any[]) => {
        if (isDev) {
            console.error(message, ...optionalParams);
        }
    };
    export const warn = (message?: any, ...optionalParams: any[]) => {
        if (isDev) {
            console.warn(message, ...optionalParams);
        }
    };
}