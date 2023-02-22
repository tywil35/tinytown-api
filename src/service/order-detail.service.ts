import { OrderService } from "../mysql/service/order.service";
import { UserProfileGoaModel } from "../mysql/model/user.model";
import { UserService } from "../mysql/service/user.service";
import { InvoiceItemJoinProductModel } from "../mysql/model/invoice-item.model";

export namespace OrderDetailService {
    export type Request = { user_id: string, order_id: string };
    export type Response = { user: UserProfileGoaModel, items: InvoiceItemJoinProductModel[] };
    const user_service = new UserService();
    const service = new OrderService();
    export const AllOrders = async (req: Request): Promise<Response> => {
        const user = await user_service.findUser(req.user_id);
        const res_user: UserProfileGoaModel = {
            username: user.username,
            email: user.email,
            cell: user.cell,
            goa_member_number: user.goa_member_number,
            address_line: user.address_line,
        }
        const order_items = await service.findOrderItem(req.order_id);
        return { user: res_user, items: order_items };
    }
}
