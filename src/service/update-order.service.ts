import { OrderService } from "../mysql/service/order.service";
import { InvoiceModel, InvoiceStatusEnum } from "../mysql/model/invoice.model";

export namespace UpdateOrderService {
    export type Request = {
        user_id: string,
        invoice_id: string
    };
    export type Response = { message: string };
    const service = new OrderService();
    const fetchInvoice = async (id: string): Promise<InvoiceModel> => {
        const invoice = await service.find(id);
        if (!invoice) { throw Error('No invoice found'); }
        return invoice;
    }
    export const OrderCultivated = async (req: Request): Promise<Response> => {
        service.setUserId(req.user_id);
        const invoice = await fetchInvoice(req.invoice_id);
        invoice.invoice_status = InvoiceStatusEnum.Cultivated;
        await service.updateOrder(invoice);
        return { message: 'order cultivated' };
    }
    export const OrderCancel = async (req: Request): Promise<Response> => {
        service.setUserId(req.user_id);
        const invoice = await fetchInvoice(req.invoice_id);
        invoice.invoice_status = InvoiceStatusEnum.Cancel;
        await service.updateOrder(invoice);
        return { message: 'order cancelled' };
    }
}
