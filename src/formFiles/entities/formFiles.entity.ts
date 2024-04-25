
import { ObjectType } from '@nestjs/graphql';
import {
    Column, CreateDateColumn, UpdateDateColumn,
    DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Forms } from '../../forms/entities/form.entity';
@Entity('formFiles')
@ObjectType()
export class FormFiles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(null, { nullable: true })
    file_uuid: string;

    @Column()
    formsId: number;

    @Column()
    filename: string;

    @Column({
        type: 'bytea',
    })
    data: Uint8Array;

    @UpdateDateColumn({ name: 'updatedAt', nullable: true })
    updatedAt: string;

    @CreateDateColumn({ name: 'createdAt', nullable: true })
    createdAt: string;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt: string;
      
    @ManyToOne(() => Forms, (form) => form.formFile)
    @JoinColumn({
      name: 'formsId', //fk id
    })
    form: Forms | null; 
}
