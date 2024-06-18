import { BadRequestException, Injectable } from '@nestjs/common';
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
      savingUpdate.saving_id_fk.saving_id,
    )) as Savings;

    const savingTransactions = {
      trasac_name: savingFound.saving_name,
      trasac_description: `Trasanccion destina para el ahorro ${savingFound.saving_name}`,
      trasac_quantity: savingUpdate.amount,
      account_id_fk: savingUpdate.account_id_fk,
      ttrac_id_fk: savingUpdate.ttrac_id_fk,
      saving_id_fk: savingUpdate.saving_id_fk,
    };
    await this.transactionsServices.createTransaction(savingTransactions);

    const amountTotal =
      parseFloat(savingFound.saving_quantity_total.toString()) +
      savingUpdate.amount;
    // console.log(amountTotal);
    return await this.savingsRepository.update(
      savingUpdate.saving_id_fk.saving_id,
      {
        saving_quantity_total: amountTotal,
      },
    );
  }
  async createSavings(saving: CreateSavingsDto) {
    const accountFound = (await this.userServices.getAccount(
      saving.account_id_fk.account_id,
    )) as Accounts;

    const savingID = this.createIDSaving(
      saving.account_id_fk.account_id,
      accountFound.savings.length,
    );
    if (accountFound.account_balance < saving.saving_quantity_total) {
      throw new BadRequestException({
        typeCode: 'SavingWrong',
        message: 'La trasancción supera el valor disponible en su cuenta',
      });
    }
    console.log(saving);
    const newSavings: Savings = this.savingsRepository.create({
      ...saving,
      saving_id: savingID,
    });

    await this.savingsRepository.save(newSavings);
    const savingTransactions = {
      trasac_name: saving.saving_name,
      trasac_description: `Trasanccion destina para el ahorro ${saving.saving_name}`,
      trasac_quantity: saving.saving_quantity_total,
      account_id_fk: saving.account_id_fk,
      ttrac_id_fk: saving.ttrac_id_fk,
      saving_id_fk: savingID,
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
      where: { saving_id: savingID },
    })) as Savings;

    return savingFound;
  }
  async deleteSaving(savingID: string) {
    const savingDelete = this.savingsRepository.delete(savingID);
    return savingDelete;
  }
  async getAllSavings(AccountID: string) {
    const savingsFound = (await this.savingsRepository.find({
      where: { account_id_fk: { account_id: AccountID } },
    })) as Savings[];

    return savingsFound;
  }
}
