import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Transactions } from './transactions.entity';

@Entity('tipo_trasacciones')
export class TypeTrasanctions {
  @PrimaryColumn({
    primaryKeyConstraintName: 'ttrac_id_pk',
    type: 'integer',
  })
  ttrac_id: number;

  @Column({ type: 'varchar', length: '25' })
  ttracc_nombre: string;

  @Column({ type: 'varchar', length: '60' })
  ttrac_descripcion: string;

  @OneToMany(() => Transactions, (transactions) => transactions.ttrac_id_fk)
  transactions: Transactions[];
}
