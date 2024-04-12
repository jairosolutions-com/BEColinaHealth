
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('labResultsFiles')
class LabResultsFiles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(null, { nullable: true })
    file_uuid: string;


    @Column()
    filename: string;

    @Column({
        type: 'bytea',
    })
    data: Uint8Array;

    // @OneToOne(() => LabResults, (lab) => lab.file)
    // @JoinColumn({
    //   name: 'lab',
    // })
    // lab: LabResults;
    
    @OneToOne(() => LabResults, (lab) => lab.labFile)
    @JoinColumn({ name: 'labFileId' }) // Specify the column name for the foreign key
    lab: LabResults;

}

export default LabResultsFiles;