import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import {
  CreateCardDto,
  // CreateCardDebitDto,
} from 'src/dto/create-cards.dto';

@Controller('cards')
export class CardsController {
  constructor(private cardsServices: CardsService) {}

  @Get(':id')
  getAllCards(@Param('id') id: string) {
    return this.cardsServices.getAllCards(id);
  }
  @Get('/credit')
  getAllCardsCredit() {
    return this.cardsServices.getAllCardsCredit();
  }

  // @Get('/vencimiento')
  // DateDueCard() {
  //   return this.cardsServices.verifyCards();
  // }

  @Get('/one/:id')
  getCard(@Param('id') id: string) {
    return this.cardsServices.getCard(id);
  }

  // @Get('/actualizar/:id')
  // actualizar(@Param('id') id: string) {
  //   return this.cardsServices.verifyDueCard(id);
  // }

  @Post()
  createCards(@Body() newCard: CreateCardDto) {
    return this.cardsServices.createCards(newCard);
  }
}
