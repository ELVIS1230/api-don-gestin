import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Accounts } from './accounts.entity';
import { Reminders } from 'src/reminders/reminders.entity';

@Entity('users')
@Unique('email_unique', ['u_email'])
@Unique('account_id_unique', ['account_id_fk'])
export class Users {
  @PrimaryColumn({
    type: 'varchar',
    length: '10',
    unique: true,
    primaryKeyConstraintName: 'u_cedula_pk',
  })
  u_cedula: string;

  @Column({ type: 'varchar', length: '25' })
  u_name: string;

  @Column({ type: 'varchar', length: '10' })
  u_lastname: string;

  @Column({ type: 'varchar', length: '40' })
  u_email: string;

  @Column({ type: 'varchar', length: '30' })
  u_password: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => Accounts)
  @JoinColumn({
    name: 'account_id_fk',
    // referencedColumnName: 'account_id',
    foreignKeyConstraintName: 'account_id_fk',
  })
  account_id_fk: Accounts;

  @OneToMany(() => Reminders, (reminder) => reminder.u_cedula_fk)
  reminders: Reminders[];
}
