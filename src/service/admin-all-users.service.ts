import { UserModel } from "../mysql/model/user.model";
import { UserService } from "../mysql/service/user.service";

export namespace AdminAllUsersService {
    export type Response = UserModel[];
    const service = new UserService();
    export const AllUsers = async (): Promise<Response> => {
        return service.findAllUsers();
    }
}
