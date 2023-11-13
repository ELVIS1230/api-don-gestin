import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cards } from './cards.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Accounts } from 'src/users/accounts.entity';
import { CreateCardDto } from 'src/dto/create-cards.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards) private cardsRepository: Repository<Cards>,
    private userServices: UsersService,
  ) {}

  async createCards(card: CreateCardDto) {
    const accountFound = (await this.userServices.getAccount(
      card.cuenta_id_fk.cuenta_id,
    )) as Accounts;

    if (accountFound instanceof HttpException) {
      return new HttpException('Cuenta no encontrada', HttpStatus.NOT_FOUND);
    }
    const cardID = this.createIDCard(card, accountFound.cards.length);

    let newCard: CreateCardDto;
    if (card.tiptarj_id_fk.tiptarj_id === 1) {
      newCard = this.cardsRepository.create({
        ...card,
        tarj_id: cardID,
        tarj_saldo_total: card.tarj_cupo,
        tarj_saldo_pagar: 0.0,
      });
    } else if (card.tiptarj_id_fk.tiptarj_id === 2) {
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
    if (card.tiptarj_id_fk.tiptarj_id === 1) {
      typeCard = 'C';
    } else if (card.tiptarj_id_fk.tiptarj_id === 2) {
      typeCard = 'D';
    }
    const cardID: string =
      card.cuenta_id_fk.cuenta_id.substring(8, 12) +
      'TAR' +
      typeCard +
      numberCard;
    return cardID;
  }
}
