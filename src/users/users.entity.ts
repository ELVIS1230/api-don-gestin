import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity('usuarios')
@Unique('correo_unico', ['u_correo'])
export class Users {
  @PrimaryColumn({ type: 'varchar', length: '10' })
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
}
