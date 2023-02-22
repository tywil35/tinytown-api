import { LogUtil } from "../utils/log.util";
import { HashedPassword, HashPasswordUtil } from "../utils";
import { UserService } from "../mysql/service/user.service";
import { StringEmptyUtil } from "../utils/string-empty.utl";
import { JwtUtil } from "../utils/jwt.util";
import { UserStatusEnum } from "../mysql/model/user.model";

export namespace LoginUserService {
    export type Request = { email: string, psswrd: string };
    export type Response = { access_token: string };
    const service = new UserService();
    const validateRequest = (data: Request): string => {
        const validation_errors = [];
        if (StringEmptyUtil.Is(data.email)) {
            validation_errors.push('email missing');
        }
        if (StringEmptyUtil.Is(data.psswrd)) {
            validation_errors.push('password missing');
        }
        return validation_errors.join(', ');
    }
    export const LoginUser = async (user: Request): Promise<Response> => {
        const validation_errors = validateRequest(user);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '') { throw Error(validation_errors); }
        const usr_xst = await service.findUserByEmail(user.email).catch(err => LogUtil.warn(err, 'errer'));
        if (!usr_xst) { throw Error(`Cannot find user`); }
        LogUtil.info('Login user account', user.email);
        const hashed: HashedPassword = {
            hash: usr_xst.pswrd_hash,
            salt: usr_xst.pswrd_salt
        }
        const matched = await HashPasswordUtil.CompareHashedPassword(user.psswrd, hashed);
        if (!matched) {
            LogUtil.info('Password incorrect', user.email);
            throw Error(`Incorrect credentials`);
        }
        service.recordUserLogin(usr_xst);
        const isGoa = usr_xst.goa_member_number != undefined && usr_xst.user_status === UserStatusEnum.ActiveMember;
        const _jwt = JwtUtil.GenerateAccessToken({ id: usr_xst.id ?? '', role: usr_xst.user_role, goa: isGoa, email: usr_xst.email });
        return _jwt;
    }
}
