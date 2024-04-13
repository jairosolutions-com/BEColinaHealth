
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('labResultsFiles')
class LabResultsFiles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(null, { nullable: true })
    file_uuid: string;

    @Column()
    labResultsId: number;

    @Column()
    filename: string;

    @Column({
        type: 'bytea',
    })
    data: Uint8Array;

    @ManyToOne(() => LabResults, (lab) => lab.labFile)
    @JoinColumn({
      name: 'labResultsId', //fk id
    })
    lab: LabResults | null;

}

export default LabResultsFiles;