
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class LabResultsFiles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    file_uuid: string;


    @Column()
    filename: string;

    @Column({
        type: 'bytea',
    })
    data: Uint8Array;
}

export default LabResultsFiles;