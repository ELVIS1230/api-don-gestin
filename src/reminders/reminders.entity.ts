import { Users } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('recordatorios')
export class Reminders {
  @PrimaryColumn({ primaryKeyConstraintName: 'recordatorios_pk' })
  record_id: string;

  @Column({ type: 'varchar' })
  record_nombre: string;

  @Column({ type: 'varchar' })
  record_descripcion: string;

  @Column({ type: 'date' })
  record_fecha: string;

  @ManyToOne(() => Users, (user) => user.reminders)
  @JoinColumn({
    foreignKeyConstraintName: 'cedula_fk',
    name: 'u_cedula_fk',
  })
  u_cedula_fk: Users;
}
