import { Users } from 'src/users/users.entity';

export class CreateRemindersDto {
  record_nombre: string;
  record_description: string;
  record_fecha: Date;
  u_cedula_fk: Users;
}
