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
      transfer_name: savingFound.aho_name,
      transfer_description: `Transaction intended for savings ${savingFound.aho_name}`,
      transfer_quantity: savingUpdate.amount,
      fk_id_account: savingUpdate.fk_id_account,
      ttrac_id_fk: savingUpdate.ttrac_id_fk,
      aho_id_fk: savingUpdate.aho_id_fk,
    };
    await this.transactionsServices.createTransaction(savingTransactions);

    const amountTotal =
      parseFloat(savingFound.aho_total_amount.toString()) +
      savingUpdate.amount;
    // console.log(amountTotal);
    return await this.savingsRepository.update(savingUpdate.aho_id_fk.aho_id, {
      aho_total_amount: amountTotal,
    });
  }
  async createSavings(saving: CreateSavingsDto) {
    const accountFound = (await this.userServices.getAccount(
      saving.fk_id_account.account_id,
    )) as Accounts;

    const savingID = this.createIDSaving(
      saving.fk_id_account.account_id,
      accountFound.savings.length,
    );

    const newSavings: Savings = this.savingsRepository.create({
      ...saving,
      aho_id: savingID,
    });

    await this.savingsRepository.save(newSavings);
    const savingTransactions = {
      transfer_name: saving.aho_name,
      transfer_description: `Transaction intended for savings ${saving.aho_name}`,
      transfer_quantity: saving.aho_total_amount,
      fk_id_account: saving.fk_id_account,
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
  async deleteSaving(savingID: string) {
    const savingDelete = this.savingsRepository.delete(savingID);
    return savingDelete;
  }
  async getAllSavings(AccountID: string) {
    const savingsFound = (await this.savingsRepository.find({
      where: { fk_id_account: { account_id: AccountID } },
    })) as Savings[];

    return savingsFound;
  }
}
