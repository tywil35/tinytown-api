import { BaseSoftDeleteModel } from "./base-soft-delete.model";

export type InvoiceModel = BaseSoftDeleteModel & {
    currency: string,
    invoice_number:number,
    user_id: string,
    total_amount: number,
    invoice_status: InvoiceStatusEnum,
    delivery_address?: string,
    delivery_note?: string,
    delivery_time?: Date,
};

export enum InvoiceStatusEnum {
    Pending = 0,
    Cultivated = 1,
    Cancel = 2,
}