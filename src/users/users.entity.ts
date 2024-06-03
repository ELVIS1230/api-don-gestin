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
@Unique('single_mail', ['u_email'])
@Unique('account_id_unica', ['fk_id_accountt'])
export class Users {
  @PrimaryColumn({
    type: 'varchar',
    length: '10',
    unique: true,
    primaryKeyConstraintName: 'u_identification_pk',
  })
  u_identification: string;

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
    name: 'fk_id_account',
    // referencedColumnName: 'account_id',
    foreignKeyConstraintName: 'fk_id_account',
  })
  fk_id_accountt: Accounts;

  @OneToMany(() => Reminders, (reminder) => reminder.u_identification_fk)
  reminders: Reminders[];
}
