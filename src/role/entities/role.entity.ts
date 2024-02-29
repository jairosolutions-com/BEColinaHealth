import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccessLevel } from 'src/user_access_level/entities/user_access_level.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => UserAccessLevel, (ual) => ual.role)
  ual: UserAccessLevel[];
}
