import { ProductOrder } from "../interface/product-order.interface";
import { OrderService } from "../mysql/service/order.service";
import { InvoiceItemModel, InvoiceModel } from "../mysql";
import { InvoiceStatusEnum } from "../mysql/model/invoice.model";
import { CurrencyEnum } from "../enum/currency.enum";
import { randomUUID } from "crypto";
import { GmailService } from "../gmailer/gmail.service";
import { EnvUtil } from "../utils";

export namespace CreateOrderService {
    export type Request = {
        user_email: string,
        user_id: string,
        delivery_address: string,
        delivery_note: string,
        delivery_time: Date,
        items: ProductOrder[]
    };
    export type Response = { message: string };
    const service = new OrderService();
    export const CreateOrder = async (req: Request): Promise<Response> => {
        service.setUserId(req.user_id);
        req.delivery_time = new Date(req.delivery_time);
        if (req.delivery_time.getDay() === 0) {
            req.delivery_time.setDate(req.delivery_time.getDate() + 2);
        }
        if (req.delivery_time.getDay() === 1) {
            req.delivery_time.setDate(req.delivery_time.getDate() + 1);
        }
        /*         const new_order: InvoiceModel = {
                    id: randomUUID(),
                    invoice_number: 0,
                    currency: CurrencyEnum.RAND,
                    user_id: req.user_id,
                    total_amount: 0,
                    invoice_status: InvoiceStatusEnum.Pending,
                    delivery_address: req.delivery_address,
                    delivery_note: req.delivery_note,
                    delivery_time: req.delivery_time,
                }; */
        const new_order_csrf: InvoiceModel = {
            id: randomUUID(),
            invoice_number: 0,
            currency: CurrencyEnum.CSRF,
            user_id: req.user_id,
            total_amount: 0,
            invoice_status: InvoiceStatusEnum.Pending,
            delivery_address: req.delivery_address,
            delivery_note: req.delivery_note,
            delivery_time: req.delivery_time,
        };
        let ignore_csrf = 0;
        //let ignore_r = 0;
        for (let index = 0; index < req.items.length; index++) {
            const item = req.items[index];
            const invoice_item: InvoiceItemModel = {
                invoice_id: '',
                product_id: item.id ?? '',
                product_quantity: item.quantity,
                product_option: JSON.stringify(item.option),
            }
            ignore_csrf++;
            new_order_csrf.total_amount += (item.quantity * item.option.price);
            invoice_item.invoice_id = new_order_csrf.id ?? '';
            /*             if (item.currency === CurrencyEnum.CSRF) {
                            ignore_csrf++;
                            new_order_csrf.total_amount += (item.quantity * item.option.price);
                            invoice_item.invoice_id = new_order_csrf.id ?? '';
                        } else {
                            ignore_r++;
                            new_order.total_amount += (item.quantity * item.option.price);
                            invoice_item.invoice_id = new_order.id ?? '';
                        } */
            await service.createOrderItem(invoice_item);
        }
        if (ignore_csrf !== 0) {
            await service.createOrder(new_order_csrf)
        }
        /*         if (ignore_r !== 0) {
                    await service.createOrder(new_order)
                } */
        GmailService.SendMail({ from: EnvUtil.MAILER_USER, bcc: EnvUtil.MAILER_USER, to: req.user_email, subject: `Cultivation Share Request Sent ${new_order_csrf.invoice_number}`, html: `${EnvUtil.MAILER_TEMPLATES_PATH}/csr.html` })
        return { message: 'created order' };
    }
}
