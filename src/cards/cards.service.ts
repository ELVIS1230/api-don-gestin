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
  //   const currentDate = new Date();
  //   this.logger.debug(`fecha actual ${currentDate}`);
  //   await this.verifyCards();
  // }

  async verifyCards() {
    const cards = (await this.getAllCardsCredit()) as Cards[];
    const updatedCards: Cards[] = [];
    for (const card of cards) {
      if (await this.verifyDueCard(card.tarj_id)) {
        await this.updateDateDueDate(card.tarj_id);
        await this.updateDateCutoffDate(card.tarj_id);
        updatedCards.push(card);
      }
    }
    return updatedCards;
  }

  async verifyDueCard(CardID: string): Promise<boolean> {
    const cardFound = (await this.getCard(CardID)) as Cards;
    const today = dayjs().format('YYYY-MM-DD');
    if (cardFound.expiration_date_card.toString() === today) {
      console.log(today);
      return true;
    } else {
      return false;
    }
  }

  async updateDateCutoffDate(CardID: string) {
    const cardFound = (await this.getCard(CardID)) as Cards;
    const updateCardDate = dayjs(cardFound.cut_date_card, 'YYYY-MM-DD')
      .add(1, 'month')
      .toDate();

    cardFound.cut_date_card = updateCardDate;
    return await this.cardsRepository.save(cardFound);
  }

  async updateDateDueDate(CardID: string) {
    const cardFound = (await this.getCard(CardID)) as Cards;
    console.log(cardFound);
    const updateCardDate = dayjs(cardFound.expiration_date_card, 'YYYY-MM-DD')
      .add(1, 'month')
      .toDate();

    cardFound.expiration_date_card = updateCardDate;
    return await this.cardsRepository.save(cardFound);
  }

  async getAllCardsCredit() {
    const cardsFounds = await this.cardsRepository.find({
      where: { tiptarj_id_fk: { tiptarj_id: 1 } },
    });

    return cardsFounds
      ? cardsFounds
      : new HttpException(
          'There was an error finding the cards',
          HttpStatus.CONFLICT,
        );
  }
  async getAllCards(accountID: string) {
    const cardsFounds = await this.cardsRepository.find({
      where: { fk_id_account: { account_id: accountID } },
      relations: ['tiptarj_id_fk', 'mtarj_id_fk'],
    });

    return cardsFounds
      ? cardsFounds
      : new HttpException(
          'There was an error finding the cards',
          HttpStatus.CONFLICT,
        );
  }
  async getCard(cardID: string) {
    const cardFound = (await this.cardsRepository.findOne({
      where: { tarj_id: cardID },
    })) as Cards;
    return cardFound
      ? (cardFound as Cards)
      : new HttpException('Card not found', HttpStatus.NOT_FOUND);
  }

  async createCards(card: CreateCardDto) {
    const accountFound = (await this.userServices.getAccount(
      card.fk_id_account.account_id,
    )) as Accounts;

    if (accountFound instanceof HttpException) {
      return new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    const cardID = this.createIDCard(card, accountFound.cards.length);

    let newCard: CreateCardDto;
    if (card.tiptarj_id_fk.tiptarj_id === 1) {
      newCard = this.cardsRepository.create({
        ...card,
        tarj_id: cardID,
        total_balance_card: card.quota_card,
        card_balance_pay: 0.0,
      });
    } else if (card.tiptarj_id_fk.tiptarj_id === 2) {
      newCard = this.cardsRepository.create({
        ...card,
        tarj_id: cardID,
        total_balance_card: 0.0,
      });
    }

    console.log(card);
    console.log(cardID);
    return await this.cardsRepository.save(newCard);
  }

  createIDCard(card: CreateCardDto, numberCard: number) {
    let typeCard = '';
    if (card.tiptarj_id_fk.tiptarj_id === 1) {
      typeCard = 'C';
    } else if (card.tiptarj_id_fk.tiptarj_id === 2) {
      typeCard = 'D';
    }
    const cardID: string =
      card.fk_id_account.account_id.substring(8, 12) +
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
      'total_balance_card',
      Amount,
    );
    const cardDecrementDebt = await this.cardsRepository.decrement(
      {
        tarj_id: cardID,
      },
      'card_balance_pay',
      Amount,
    );
    return { cardIncrement, cardDecrementDebt };
  }
  async decrementBalanceCard(cardID: string, Amount: number) {
    const cardDecrement = await this.cardsRepository.decrement(
      {
        tarj_id: cardID,
      },
      'total_balance_card',
      Amount,
    );
    const cardIncrementDebt = await this.cardsRepository.increment(
      {
        tarj_id: cardID,
      },
      'card_balance_pay',
      Amount,
    );
    return { cardDecrement, cardIncrementDebt };
  }
}
