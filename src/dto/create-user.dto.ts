export class CreateUserDto {
  u_cedula: string;
  u_nombre: string;
  u_apellido: string;
  u_correo: string;
  u_contraseña: string;
  cuenta_id_fk?: string;
  // createdAt: Date;
}
