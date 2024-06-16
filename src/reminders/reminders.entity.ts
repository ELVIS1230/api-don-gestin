import { Users } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('reminders')
export class Reminders {
  @PrimaryColumn({ primaryKeyConstraintName: 'reminders_pk' })
  remind_id: string;

  @Column({ type: 'varchar' })
  remind_name: string;

  @Column({ type: 'varchar' })
  remind_description: string;

  @Column({ type: 'date' })
  remind_date: string;

  @ManyToOne(() => Users, (user) => user.reminders)
  @JoinColumn({
    foreignKeyConstraintName: 'cedula_fk',
    name: 'u_cedula_fk',
  })
  u_cedula_fk: Users;
}
