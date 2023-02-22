import { UserService } from "../mysql/service/user.service";
import { StringEmptyUtil } from "../utils/string-empty.utl";
import { UserProfileModel } from "../mysql/model/user.model";

export namespace UserProfileService {
    export type Request = { user_id: string, address?: string };
    export type Response = UserProfileModel;
    const service = new UserService();
    const validateRequest = (data: Request): string => {
        const validation_errors = [];
        if (StringEmptyUtil.Is(data.address)) {
            validation_errors.push('address missing');
        }
        return validation_errors.join(', ');
    }
    export const UserProfile = async (user: Request): Promise<Response> => {
        return service.findUserProfileById(user.user_id);
    }
}
