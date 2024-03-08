import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccessLevels } from 'src/userAccessLevels/entities/userAccessLevels.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => UserAccessLevels, (ual) => ual.roles)
  ual: UserAccessLevels[];
}
