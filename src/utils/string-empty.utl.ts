export namespace StringEmptyUtil {
    export const Is = (s?: string): boolean => {
        return s == undefined || s == '';
    }
}