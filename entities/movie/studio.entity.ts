import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'entities/base.entity';
import { IStudio } from 'interface-models/movie/studio.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'studios' })
export class Studio extends BaseEntity implements IStudio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'studio_number' })
    @IsNotEmpty()
    studioNumber: number;

    @Column({ name: 'seat_capacity' })
    @IsNotEmpty()
    seatCapacity: number;
}
