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

  async loginUser(userLogin: { email: string; password: string }) {
    const userFound = (await this.userRepository.findOne({
      where: { u_email: userLogin.email, u_password: userLogin.password },
      relations: ['account_id_fk', 'reminders'],
    })) as Users;

    // console.log(userFound);
    return userFound
      ? userFound
      : new HttpException(
          'Credenciales incorrectas o no encontradas',
          HttpStatus.NOT_FOUND,
        );
  }
  async getUser(u_cedula: string) {
    const userFound = await this.userRepository.findOne({
      where: { u_cedula },
      relations: ['account_id_fk', 'reminders'],
    });

    return userFound
      ? userFound
      : new HttpException('Usuario no encontrado ', HttpStatus.NOT_FOUND);
  }

  async getAccount(account_id: string) {
    const accoutFound = await this.accountRepository.findOne({
      where: { account_id },
      relations: ['cards', 'savings'],
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
      account_id_fk: accountID,
    });
    return this.userRepository.save(newUser);
  }

  createIDAccount(userFound) {
    // const userSplit = userFound.u_cedula.substring(0, 8);
    const AccountsID =
      userFound.u_cedula +
      userFound.u_name[0].toUpperCase() +
      userFound.u_lastname[0].toUpperCase();

    return AccountsID;
  }
  createAccount(AccountsID: string) {
    const newAccount = this.accountRepository.create({
      account_id: AccountsID,
    });
    const savedAccount = this.accountRepository.save(newAccount);
    return savedAccount;
  }
  async incrementBalanceAccount(AccountsID: any, Amount: number) {
    console.log(AccountsID);
    const accountRepository = await this.accountRepository.increment(
      {
        account_id: AccountsID,
      },
      'account_balance',
      Amount,
    );
    return accountRepository;
  }
  async decrementBalanceAccount(AccountsID: string, Amount: number) {
    const accountRepository = await this.accountRepository.decrement(
      {
        account_id: AccountsID,
      },
      'account_balance',
      Amount,
    );
    return accountRepository;
  }
}
