import { LogUtil } from "../utils/log.util";
import { UserService } from "../mysql/service/user.service";
import { StringEmptyUtil } from "../utils/string-empty.utl";
export namespace UserUpdateAddressService {
    export type Request = { user_id: string, address?: string };
    export type Response = { message: string };
    const service = new UserService();
    const validateRequest = (data: Request): string => {
        const validation_errors = [];
        if (StringEmptyUtil.Is(data.address)) {
            validation_errors.push('address missing');
        }
        return validation_errors.join(', ');
    }
    export const UserUpdateAddress = async (user: Request): Promise<Response> => {
        const validation_errors = validateRequest(user);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '') { throw Error(validation_errors); }
        const xst_usr = await service.findUser(user.user_id);
        if (!xst_usr) { throw Error('wrong stuff'); }
        xst_usr.address_line = user.address;
        await service.updateUser(xst_usr);
        return { message: 'updated address' };
    }
}
