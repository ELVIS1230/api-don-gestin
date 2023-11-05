import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('accounts')
class Accounts {
  // @Column({ unique: true })
  @PrimaryColumn()
  id: string;

  @Column()
  balance: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column()
  idUser: string;
}
