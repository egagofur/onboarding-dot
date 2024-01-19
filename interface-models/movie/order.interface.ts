import { IUser } from 'apps/backoffice/app/Modules/Profile/Entities';
import { IBaseEntity } from 'interface-models/base-entity.interface';

export enum PaymentMethod {
    Cash = 'Cash',
    CreditCard = 'CreditCard',
    DebitCard = 'DebitCard',
    Paypal = 'Paypal',
    Other = 'Other',
}

export interface IOrder extends IBaseEntity {
    id: number;
    user: IUser;
    paymentMethod: PaymentMethod;
    totalItemsPrice: number;
}
