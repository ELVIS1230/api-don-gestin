import { Users } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('reminders')
export class Reminders {
  @PrimaryColumn({ primaryKeyConstraintName: 'reminders_pk' })
  record_id: string;

  @Column({ type: 'varchar' })
  record_name: string;

  @Column({ type: 'varchar' })
  record_description: string;

  @Column({ type: 'date' })
  record_date: string;

  @ManyToOne(() => Users, (user) => user.reminders)
  @JoinColumn({
    foreignKeyConstraintName: 'identification_fk',
    name: 'u_identification_fk',
  })
  u_identification_fk: Users;
}
