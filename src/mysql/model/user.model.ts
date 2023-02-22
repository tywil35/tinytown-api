import { BaseSoftDeleteModel } from "./base-soft-delete.model";

export type UserModel = BaseSoftDeleteModel & {
    login_time?: Date,
    username: string,
    email: string,
    cell: string,
    pswrd_hash: string,
    pswrd_salt: string,
    goa_member_signup?: boolean,
    goa_member_number?: string,
    address_line?: string,
    user_role: UserRoleEnum,
    user_status: UserStatusEnum
};
export type UserProfileModel = {
    username: string,
    email: string,
    cell: string,
    address_line?: string,
};
export type UserProfileGoaModel = {
    username: string,
    email: string,
    cell: string,
    goa_member_number?: string,
    address_line?: string,
};
export enum UserStatusEnum {
    Active = 1,
    Inactive = 2,
    ActiveMember = 3,
    BlockMember = 4
}

export enum UserRoleEnum {
    SA = 1,
    FrontCounter = 2,
    BudBar = 3,
    GoaMember = 4,
    Customer = 5
}

export const Staff = [UserRoleEnum.SA, UserRoleEnum.FrontCounter, UserRoleEnum.BudBar]