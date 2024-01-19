import { BaseEntity } from 'entities/base.entity';
import { User } from 'entities/iam/user.entity';
import { IUser } from 'interface-models/iam/user.interface';
import { IOrder, PaymentMethod } from 'interface-models/movie/order.interface';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order extends BaseEntity implements IOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: IUser;

    @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.Cash })
    paymentMethod: PaymentMethod;

    @Column()
    totalItemsPrice: number;
}
