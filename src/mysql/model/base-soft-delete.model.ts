import { BaseModel } from "./base.model";

export type BaseSoftDeleteModel = BaseModel & {
    delete_time?: Date,
}
