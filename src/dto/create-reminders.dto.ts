import { Users } from 'src/users/users.entity';

export class CreateRemindersDto {
  record_name: string;
  record_description: string;
  record_date: string;
  u_identification_fk: Users;
}
