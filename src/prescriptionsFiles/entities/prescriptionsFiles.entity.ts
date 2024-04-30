import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { Column,  CreateDateColumn, UpdateDateColumn,
  DeleteDateColumn,Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('prescriptionFiles')
export class PrescriptionsFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(null, { nullable: true })
  file_uuid: string;  

  @Column() 
  prescriptionsId: number;

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
  @ManyToOne(
    () => Prescriptions,
    (prescription) => prescription.prescriptionFile,
  )
  @JoinColumn({
    name: 'prescriptionsId', //fk id
  })
  prescription: Prescriptions | null;
}

