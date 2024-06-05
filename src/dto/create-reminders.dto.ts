import { Users } from 'src/users/users.entity';

export class CreateRemindersDto {
  remind_name: string;
  remind_description: string;
  remind_date: string;
  u_cedula_fk: Users;
}
