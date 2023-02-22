import { LogUtil } from "../utils/log.util";
import { UserModel, UserRoleEnum, UserStatusEnum } from "../mysql/model/user.model";
import { HashPasswordUtil } from "../utils";
import { UserService } from "../mysql/service/user.service";
import { StringEmptyUtil } from "../utils/string-empty.utl";

export namespace RegisterEmployeeService {
    export type Request = { username: string, email: string, cell: string, psswrd: string, role: UserRoleEnum };
    export type Response = { message: string };
    const service = new UserService();
    const validateRequest = (data: Request): string => {
        const validation_errors = [];
        if (StringEmptyUtil.Is(data.email)) {
            validation_errors.push('email missing');
        }
        if (data.role && ![UserRoleEnum.BudBar, UserRoleEnum.FrontCounter, UserRoleEnum.SA].includes(data.role)) {
            validation_errors.push('Role missing or incorrect');
        }
        if (StringEmptyUtil.Is(data.psswrd)) {
            validation_errors.push('password missing');
        }
        return validation_errors.join(', ');
    }
    export const RegisterEmployee = async (user: Request): Promise<Response> => {
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
                user_role: user.role,
                user_status: UserStatusEnum.Inactive,
            }
            LogUtil.info('New user', new_user);
            return new_user;
        });
        await service.createUser(new_user).catch(err => { LogUtil.error(err); throw err; });
        const _role = user.role == 1 ? 'Super Admin' : user.role == 2 ? 'Shop Employee' : user.role == 3 ? 'Bud Bar Employee' : 'NOT_RIGHT';
        return { message: `${user.username} employee add as ${_role}.` };
    }
}
