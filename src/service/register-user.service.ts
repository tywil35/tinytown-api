import { LogUtil } from "../utils/log.util";
import { UserModel, UserRoleEnum, UserStatusEnum } from "../mysql/model/user.model";
import { HashPasswordUtil } from "../utils";
import { UserService } from "../mysql/service/user.service";
import { StringEmptyUtil } from "../utils/string-empty.utl";

export namespace RegisterUserService {
    export type Request = { username: string, email: string, cell: string, psswrd: string, verifyGoa: boolean };
    export type Response = { message: string };
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
    export const RegisterUser = async (user: Request): Promise<Response> => {
        const validation_errors = validateRequest(user);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '') { throw Error(validation_errors); }
        const usr_xst = await service.findUserByEmail(user.email).catch(err => LogUtil.warn(err, 'errer'));
        if (usr_xst) { throw Error(`User with email ${user.email} already exists`); }
        LogUtil.info('Create new user account', user.email);
        const new_user = await HashPasswordUtil.HashPassword(user.psswrd).then(hashed => {
            const new_user: UserModel = {
                username: user.username,
                email: user.email,
                cell: user.cell,
                pswrd_hash: hashed.hash,
                pswrd_salt: hashed.salt,
                goa_member_signup: user.verifyGoa,
                user_role: UserRoleEnum.Customer,
                user_status: UserStatusEnum.Inactive,
            }
            LogUtil.info('New user', new_user);
            return new_user;
        });
        await service.createUser(new_user).catch(err => { LogUtil.error(err); throw err; });
        return { message: `${user.username}, Tiny Town will contact you for account activation. ${user.verifyGoa ? 'GOA Memebers are contacted for verification.' : ''}` };
    }
}
