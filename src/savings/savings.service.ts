import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Savings } from './savings.entity';
import { Repository } from 'typeorm';
import { CreateSavingsDto } from 'src/dto/create-savings.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { UsersService } from 'src/users/users.service';
import { Accounts } from 'src/users/accounts.entity';
import { SavingUpdateDto } from 'src/dto/saving-update.dto';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(Savings) private savingsRepository: Repository<Savings>,
    private transactionsServices: TransactionsService,
    private userServices: UsersService,
  ) {}

  // async updateAmountSaving(savingUpdate: { savingID: string; amount: number }) {
  async updateAmountSaving(savingUpdate: SavingUpdateDto) {
    const savingFound = (await this.getSaving(
      savingUpdate.aho_id_fk.aho_id,
    )) as Savings;

    const savingTransactions = {
      trasac_nombre: savingFound.aho_nombre,
      trasac_descripcion: `Trasanccion destina para el ahorro ${savingFound.aho_nombre}`,
      trasac_cantidad: savingUpdate.amount,
      cuenta_id_fk: savingUpdate.cuenta_id_fk,
      ttrac_id_fk: savingUpdate.ttrac_id_fk,
      aho_id_fk: savingUpdate.aho_id_fk,
    };
    await this.transactionsServices.createTransaction(savingTransactions);

    const amountTotal =
      parseFloat(savingFound.aho_cantidad_total.toString()) +
      savingUpdate.amount;
    // console.log(amountTotal);
    return await this.savingsRepository.update(savingUpdate.aho_id_fk.aho_id, {
      aho_cantidad_total: amountTotal,
    });
  }
  async createSavings(saving: CreateSavingsDto) {
    const accountFound = (await this.userServices.getAccount(
      saving.cuenta_id_fk.cuenta_id,
    )) as Accounts;

    const savingID = this.createIDSaving(
      saving.cuenta_id_fk.cuenta_id,
      accountFound.savings.length,
    );

    const newSavings: Savings = this.savingsRepository.create({
      ...saving,
      aho_id: savingID,
    });

    await this.savingsRepository.save(newSavings);
    const savingTransactions = {
      trasac_nombre: saving.aho_nombre,
      trasac_descripcion: `Trasanccion destina para el ahorro ${saving.aho_nombre}`,
      trasac_cantidad: saving.aho_cantidad_total,
      cuenta_id_fk: saving.cuenta_id_fk,
      ttrac_id_fk: saving.ttrac_id_fk,
      aho_id_fk: savingID,
    };

    await this.transactionsServices.createTransaction(savingTransactions);
    return newSavings;
  }

  createIDSaving(AccountID: string, numberSaving: number) {
    const savingID = AccountID.substring(10, 12) + 'AHO' + numberSaving;
    return savingID;
  }

  async getSaving(savingID: string) {
    const savingFound = (await this.savingsRepository.findOne({
      where: { aho_id: savingID },
    })) as Savings;

    return savingFound;
  }
  async getAllSavings(AccountID: string) {
    const savingsFound = (await this.savingsRepository.find({
      where: { cuenta_id_fk: { cuenta_id: AccountID } },
    })) as Savings[];

    return savingsFound;
  }
}
