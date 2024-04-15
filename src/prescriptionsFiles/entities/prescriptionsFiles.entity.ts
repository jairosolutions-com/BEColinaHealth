
import { LabResults as Prescriptions } from 'src/labResults/entities/labResults.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('prescriptionFiles')
class LabResultsFiles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(null, { nullable: true })
    file_uuid: string;

    @Column()
    prescriptionsUuid: number;

    @Column()
    filename: string;

    @Column({
        type: 'bytea',
    })
    data: Uint8Array;

    @ManyToOne(() => Prescriptions, (presc) => presc.prescFile)
    @JoinColumn({
      name: 'prescriptionsId', //fk id
    })
    lab: Prescriptions | null;

}

export default LabResultsFiles;