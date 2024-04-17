import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToOne(
    () => Prescriptions,
    (prescription) => prescription.prescriptionFile,
  )
  @JoinColumn({
    name: 'prescriptionsId', //fk id
  })
  prescription: Prescriptions | null;
}
