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
      relations: ['fk_id_accountt', 'reminders'],
    })) as Users;

    // console.log(userFound);
    return userFound
      ? userFound
      : new HttpException(
          'Incorrect or missing credentials',
          HttpStatus.NOT_FOUND,
        );
  }
  async getUser(u_identification: string) {
    const userFound = await this.userRepository.findOne({
      where: { u_identification },
      relations: ['fk_id_account', 'reminders'],
    });

    return userFound
      ? userFound
      : new HttpException('User not found ', HttpStatus.NOT_FOUND);
  }

  async getAccount(account_id: string) {
    const accoutFound = await this.accountRepository.findOne({
      where: { account_id },
      relations: ['cards', 'savings'],
    });

    return !accoutFound
      ? new HttpException('Account not found ', HttpStatus.NOT_FOUND)
      : accoutFound;
  }

  async createUsers(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { u_identification: user.u_identification },
    });

    if (userFound) {
      return new HttpException('Existing user', HttpStatus.CONFLICT);
    }
    const accountID = this.createIDAccount(user);
    await this.createAccount(accountID);

    const newUser = this.userRepository.create({
      ...user,
      fk_id_account: accountID,
    });
    return this.userRepository.save(newUser);
  }

  createIDAccount(userFound) {
    // const userSplit = userFound.u_identification.substring(0, 8);
    const AccountsID =
      userFound.u_identification +
      userFound.u_name[0].toUpperCase() +
      userFound.u_lastname[0].toUpperCase();

    return AccountsID;
  }
  createAccount(AccountsID: string) {
    const newAccount = this.accountRepository.create({ account_id: AccountsID });
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
