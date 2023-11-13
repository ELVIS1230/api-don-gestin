import { Body, Controller, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import {
  CreateCardDto,
  // CreateCardDebitDto,
} from 'src/dto/create-cards.dto';

@Controller('cards')
export class CardsController {
  constructor(private cardsServices: CardsService) {}

  @Post()
  createCards(@Body() newCard: CreateCardDto) {
    return this.cardsServices.createCards(newCard);
  }
}
