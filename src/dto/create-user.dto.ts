export class CreateUserDto {
  u_identification: string;
  u_name: string;
  u_lastname: string;
  u_email: string;
  u_password: string;
  fk_id_account?: string;
  // createdAt: Date;
}
