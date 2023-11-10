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
      relations: ['cuenta_id_fk'],
    });

    return userFound
      ? userFound
      : new HttpException('Usuario no encontrado ', HttpStatus.NOT_FOUND);
  }

  async getAccount(cuenta_id: string) {
    const accoutFound = await this.accountRepository.findOne({
      where: { cuenta_id },
    });

    return !accoutFound
      ? new HttpException('Cuenta no encontrada ', HttpStatus.NOT_FOUND)
      : accoutFound;
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
  async incrementBalanceAccount(AccountsID: string, Amount: number) {
    const accountRepository = await this.accountRepository.increment(
      {
        cuenta_id: AccountsID,
      },
      'cuenta_saldo',
      Amount,
    );
    return accountRepository;
  }
  async decrementBalanceAccount(AccountsID: string, Amount: number) {
    const accountRepository = await this.accountRepository.decrement(
      {
        cuenta_id: AccountsID,
      },
      'cuenta_saldo',
      Amount,
    );
    return accountRepository;
  }
}
