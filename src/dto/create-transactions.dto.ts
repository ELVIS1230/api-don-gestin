export class CreateTransactionDto {
  trasac_nombre: string;
  trasac_descripcion: string;
  trasac_cantidad: number;
  trasac_fecha?: Date;
  ttrac_id_fk: number;
  cuenta_id_fk: string;
  trasac_tarjeta_fk?: string;
}
