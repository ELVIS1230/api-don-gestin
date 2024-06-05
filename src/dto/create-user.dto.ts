export class CreateUserDto {
  u_cedula: string;
  u_name: string;
  u_lastname: string;
  u_email: string;
  u_password: string;
  account_id_fk?: string;
  // createdAt: Date;
}
