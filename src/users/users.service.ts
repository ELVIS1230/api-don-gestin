import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { Accounts } from './accounts.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Accounts) private accountRepository: Repository<Accounts>,
  ) {}

  async getUser(u_cedula: string) {
    const userFound = await this.userRepository.findOne({
      where: { u_cedula },
    });

    console.log(this.createIDAccount(userFound));

    return !userFound
      ? new HttpException('Usuario no encontrado ', HttpStatus.NOT_FOUND)
      : userFound;
  }

  async createUsers(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { u_cedula: user.u_cedula },
    });

    if (userFound) {
      return new HttpException('Usuario ya existente', HttpStatus.CONFLICT);
    }
    const accountID = this.createIDAccount(user);
    await this.createAccount(accountID);

    const newUser = this.userRepository.create({
      ...user,
      cuenta_id_fk: accountID,
    });

    return this.userRepository.save(newUser);
  }

  createIDAccount(userFound) {
    // const userSplit = userFound.u_cedula.substring(0, 8);
    const AccountsID =
      userFound.u_cedula +
      userFound.u_nombre[0].toUpperCase() +
      userFound.u_apellido[0].toUpperCase();

    return AccountsID;
  }
  createAccount(AccountsID: string) {
    const newAccount = this.accountRepository.create({ cuenta_id: AccountsID });
    const savedAccount = this.accountRepository.save(newAccount);
    return savedAccount;
  }
}
