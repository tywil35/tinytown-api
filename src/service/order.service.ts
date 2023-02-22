import { OrderService } from "../mysql/service/order.service";
import { InvoiceModel } from "../mysql";
import { InvoiceStatusEnum } from "../mysql/model/invoice.model";

export namespace AllOrderService {
    export type Request = { status: InvoiceStatusEnum, goa: boolean, admin: boolean };
    export type Response = InvoiceModel[];
    const service = new OrderService();
    export const AllOrders = async (): Promise<Response> => {
        return service.findAll();
    }
    export const findByFilter = async (req: Request): Promise<Response> => {
        return service.findByFilter(req);
    }
}
