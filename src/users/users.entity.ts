import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Accounts } from './accounts.entity';

@Entity('usuarios')
@Unique('correo_unico', ['u_correo'])
@Unique('cuenta_id_unica', ['cuenta_id_fk'])
export class Users {
  @PrimaryColumn({
    type: 'varchar',
    length: '10',
    unique: true,
    primaryKeyConstraintName: 'u_cedula_pk',
  })
  u_cedula: string;

  @Column({ type: 'varchar', length: '25' })
  u_nombre: string;

  @Column({ type: 'varchar', length: '10' })
  u_apellido: string;

  @Column({ type: 'varchar', length: '40' })
  u_correo: string;

  @Column({ type: 'varchar', length: '30' })
  u_contraseña: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => Accounts)
  @JoinColumn({
    name: 'cuenta_id_fk',
    // referencedColumnName: 'cuenta_id',
    foreignKeyConstraintName: 'cuenta_id_fk',
  })
  cuenta_id_fk: Accounts;
}
