import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transactions } from './transactions.entity';

@Entity('tipo_trasacciones')
export class TypeTrasanctions {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'ttrac_id_pk' })
  ttrac_id: string;

  @Column({ type: 'varchar', length: '25' })
  ttracc_nombre: string;

  @Column({ type: 'varchar', length: '60' })
  ttrac_descripcion: string;

  @OneToMany(() => Transactions, (transactions) => transactions.ttrac_id_fk)
  transactions: Transactions[];
}
