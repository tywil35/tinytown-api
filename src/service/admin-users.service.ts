import { LogUtil } from "../utils/log.util";
import { UserModel, UserRoleEnum, UserStatusEnum } from "../mysql/model/user.model";
import { HashPasswordUtil } from "../utils";
import { UserService } from "../mysql/service/user.service";
import { StringEmptyUtil } from "../utils/string-empty.utl";

export namespace AdminUsersService {

    export type Request = { update_user_id?: string, user_id?: string, username: string, email: string, cell: string, goa_member_number?: string, address_line: string, user_role: UserRoleEnum, user_status: UserStatusEnum };
    export type Response = { message: string };
    const service = new UserService();
    const validateRequest = (data: Request): string => {
        const validation_errors = [];
        if (StringEmptyUtil.Is(data.username)) {
            validation_errors.push('username missing');
        }
        if (StringEmptyUtil.Is(data.email)) {
            validation_errors.push('email missing');
        }
        if (!data.user_role) {
            validation_errors.push('role missing');
        }
        if (!data.user_status) {
            validation_errors.push('status missing');
        }
        if (data.user_status === UserStatusEnum.ActiveMember && StringEmptyUtil.Is(data.goa_member_number)) {
            validation_errors.push('member number missing');
        }
        return validation_errors.join(', ');
    }
    export const BlockUser = async (user: Request): Promise<Response> => {
        const usr_xst = await service.findUserByEmail(user.email).catch(err => LogUtil.warn(err, 'errer'));
        if (!usr_xst) { throw Error(`User with email ${user.email} does not exist`); }
        usr_xst.user_status = UserStatusEnum.Inactive;
        service.setUserId(user.user_id);
        delete user['user_id'];
        await service.updateUser(usr_xst).catch(err => { LogUtil.error(err); throw err; });
        return { message: `${user.username}, blocked` };
    }
    export const AllowUser = async (user: Request): Promise<Response> => {
        const usr_xst = await service.findUserByEmail(user.email).catch(err => LogUtil.warn(err, 'errer'));
        if (!usr_xst) { throw Error(`User with email ${user.email} does not exist`); }
        usr_xst.user_status = (StringEmptyUtil.Is(usr_xst.goa_member_number)) ? UserStatusEnum.ActiveMember : UserStatusEnum.Active;
        service.setUserId(user.user_id);
        delete user['user_id'];
        await service.updateUser(usr_xst).catch(err => { LogUtil.error(err); throw err; });
        return { message: `${user.username}, allowed` };
    }
    export const UpdateUser = async (user: Request): Promise<Response> => {
        const validation_errors = validateRequest(user);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '' || !user.update_user_id) { throw Error(validation_errors); }
        const usr_xst = await service.findUser(user.update_user_id).catch(err => LogUtil.warn(err, 'errer'));
        const usr_xst_eml = await service.findUserByEmail(user.email).catch(err => LogUtil.warn(err, 'errer'));
        if (!usr_xst) { throw Error(`User with email ${user.email} does not exist`); }
        if (usr_xst_eml && usr_xst_eml.id && usr_xst_eml.id !== user.update_user_id) { throw Error(`User with email ${user.email} already taken`); }
        usr_xst.address_line = user.address_line;
        usr_xst.cell = user.cell;
        usr_xst.email = user.email;
        usr_xst.goa_member_number = user.goa_member_number ?? undefined;
        usr_xst.user_role = user.user_role;
        usr_xst.user_status = user.user_status;
        usr_xst.username = user.username;
        service.setUserId(user.user_id);
        delete user['user_id'];
        await service.updateUser(usr_xst).catch(err => { LogUtil.error(err); throw err; });
        return { message: `${user.username}, updated` };
    }
    export const RegisterUser = async (user: Request): Promise<Response> => {
        const validation_errors = validateRequest(user);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '') { throw Error(validation_errors); }
        const usr_xst = await service.findUserByEmail(user.email).catch(err => LogUtil.warn(err, 'errer'));
        if (usr_xst) { throw Error(`User with email ${user.email} already exists`); }
        LogUtil.info('Create new user account', user.email);
        const _gen_psswrd = HashPasswordUtil.GenerateRandomPassword();
        const new_user = await HashPasswordUtil.HashPassword(_gen_psswrd).then(hashed => {
            const new_user: UserModel = {
                username: user.username,
                email: user.email,
                cell: user.cell,
                pswrd_hash: hashed.hash,
                pswrd_salt: hashed.salt,
                goa_member_number: user.goa_member_number,
                user_role: user.user_role,
                user_status: user.user_status,
            }
            LogUtil.info('New user', new_user);
            return new_user;
        });
        service.setUserId(user.user_id);
        delete user['user_id'];
        await service.createUser(new_user).catch(err => { LogUtil.error(err); throw err; });
        return { message: `${user.username}, registeration email sent.` };
    }
}
