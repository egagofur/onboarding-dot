import { BaseEntity } from 'entities/base.entity';
import { IOrderItems } from 'interface-models/movie/order-items.interface';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Min } from 'class-validator';
import { MovieSchedule } from './movie-schedule.entity';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { IOrder } from 'interface-models/movie/order.interface';

@Entity({ name: 'order_items' })
export class OrderItems extends BaseEntity implements IOrderItems {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: IOrder;

    @ManyToOne(() => MovieSchedule, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_schedule_id' })
    schedules: IMovieSchedule;

    @Column()
    @Min(1)
    qty: number;

    @Column()
    @Min(0)
    price: number;

    @Column({ name: 'sub_total_price' })
    subTotalPrice: number;

    @Column({ name: 'snap_shot' })
    snapShot: string;
}
