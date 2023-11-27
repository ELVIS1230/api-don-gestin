import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import {
  CreateCardDto,
  // CreateCardDebitDto,
} from 'src/dto/create-cards.dto';

@Controller('cards')
export class CardsController {
  constructor(private cardsServices: CardsService) {}

  @Get()
  getAllCards() {
    return this.cardsServices.getAllCardsCredit();
  }

  // @Get('/vencimiento')
  // DateDueCard() {
  //   return this.cardsServices.verifyCards();
  // }

  @Get(':id')
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
