import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cards } from './cards.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Accounts } from 'src/users/accounts.entity';
import { CreateCardDto } from 'src/dto/create-cards.dto';
// import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards) private cardsRepository: Repository<Cards>,
    private userServices: UsersService,
  ) {}

  // private readonly logger = new Logger(CardsService.name);

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async cardsEveryFiveSecond() {
  //   const fechaActual = new Date();
  //   this.logger.debug(`fecha actual ${fechaActual}`);
  //   await this.verifyCards();
  // }

  async verifyCards() {
    const cards = (await this.getAllCardsCredit()) as Cards[];
    const cardsUpdate: Cards[] = [];
    for (const card of cards) {
      if (await this.verifyDueCard(card.tarj_id)) {
        await this.updateDateDueDate(card.tarj_id);
        await this.updateDateCutoffDate(card.tarj_id);
        cardsUpdate.push(card);
      }
    }
    return cardsUpdate;
  }

  async verifyDueCard(CardID: string): Promise<boolean> {
    const cardFound = (await this.getCard(CardID)) as Cards;
    const today = dayjs().format('YYYY-MM-DD');
    if (cardFound.card_date_due.toString() === today) {
      console.log(today);
      return true;
    } else {
      return false;
    }
  }

  async updateDateCutoffDate(CardID: string) {
    const cardFound = (await this.getCard(CardID)) as Cards;
    const updateCardDate = dayjs(cardFound.card_date_cutoff, 'YYYY-MM-DD')
      .add(1, 'month')
      .toDate();

    cardFound.card_date_cutoff = updateCardDate;
    return await this.cardsRepository.save(cardFound);
  }

  async updateDateDueDate(CardID: string) {
    const cardFound = (await this.getCard(CardID)) as Cards;
    console.log(cardFound);
    const updateCardDate = dayjs(cardFound.card_date_due, 'YYYY-MM-DD')
      .add(1, 'month')
      .toDate();

    cardFound.card_date_due = updateCardDate;
    return await this.cardsRepository.save(cardFound);
  }

  async getAllCardsCredit() {
    const cardsFounds = await this.cardsRepository.find({
      where: { typecard_id_fk: { typecard_id: 1 } },
    });

    return cardsFounds
      ? cardsFounds
      : new HttpException(
          'Hubo un error en encontrar las cards',
          HttpStatus.CONFLICT,
        );
  }
  async getAllCards(accountID: string) {
    const cardsFounds = await this.cardsRepository.find({
      where: { account_id_fk: { account_id: accountID } },
      relations: ['typecard_id_fk', 'bcard_id_fk'],
    });

    return cardsFounds
      ? cardsFounds
      : new HttpException(
          'Hubo un error en encontrar las cards',
          HttpStatus.CONFLICT,
        );
  }
  async getCard(cardID: string) {
    const cardFound = (await this.cardsRepository.findOne({
      where: { tarj_id: cardID },
    })) as Cards;
    return cardFound
      ? (cardFound as Cards)
      : new HttpException('Tarjeta no encontrada', HttpStatus.NOT_FOUND);
  }

  async createCards(card: CreateCardDto) {
    const accountFound = (await this.userServices.getAccount(
      card.account_id_fk.account_id,
    )) as Accounts;

    if (accountFound instanceof HttpException) {
      return new HttpException('Cuenta no encontrada', HttpStatus.NOT_FOUND);
    }
    const cardID = this.createIDCard(card, accountFound.cards.length);

    let newCard: CreateCardDto;
    if (card.typecard_id_fk.typecard_id === 1) {
      newCard = this.cardsRepository.create({
        ...card,
        tarj_id: cardID,
        tarj_saldo_total: card.card_quota,
        tarj_saldo_pagar: 0.0,
      });
    } else if (card.typecard_id_fk.typecard_id === 2) {
      newCard = this.cardsRepository.create({
        ...card,
        tarj_id: cardID,
        tarj_saldo_total: 0.0,
      });
    }

    console.log(card);
    console.log(cardID);
    return await this.cardsRepository.save(newCard);
  }

  createIDCard(card: CreateCardDto, numberCard: number) {
    let typeCard = '';
    if (card.typecard_id_fk.typecard_id === 1) {
      typeCard = 'C';
    } else if (card.typecard_id_fk.typecard_id === 2) {
      typeCard = 'D';
    }
    const cardID: string =
      card.account_id_fk.account_id.substring(8, 12) +
      'TAR' +
      typeCard +
      numberCard;
    return cardID;
  }

  async incrementBalanceCard(cardID: string, Amount: number) {
    const cardIncrement = await this.cardsRepository.increment(
      {
        tarj_id: cardID,
      },
      'tarj_saldo_total',
      Amount,
    );
    const cardDecrementDebt = await this.cardsRepository.decrement(
      {
        tarj_id: cardID,
      },
      'tarj_saldo_pagar',
      Amount,
    );
    return { cardIncrement, cardDecrementDebt };
  }
  async decrementBalanceCard(cardID: string, Amount: number) {
    const cardDecrement = await this.cardsRepository.decrement(
      {
        tarj_id: cardID,
      },
      'tarj_saldo_total',
      Amount,
    );
    const cardIncrementDebt = await this.cardsRepository.increment(
      {
        tarj_id: cardID,
      },
      'tarj_saldo_pagar',
      Amount,
    );
    return { cardDecrement, cardIncrementDebt };
  }
}
