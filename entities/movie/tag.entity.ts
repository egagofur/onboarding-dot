import { ITags } from 'interface-models/movie/tags.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'entities/base.entity';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity implements ITags {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    name: string;
}
