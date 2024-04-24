
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { Column,  CreateDateColumn, UpdateDateColumn,
  DeleteDateColumn,Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

    @UpdateDateColumn({ name: 'updatedAt', nullable: true })
    updatedAt: string;
  
    @CreateDateColumn({ name: 'createdAt', nullable: true })
    createdAt: string;
  
    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt: string;
  
    @ManyToOne(() => LabResults, (lab) => lab.labFile)
    @JoinColumn({
      name: 'labResultsId', //fk id
    })
    lab: LabResults | null;

}

export default LabResultsFiles;
