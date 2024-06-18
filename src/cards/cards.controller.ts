import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import {
  CreateCardDto,
  // CreateCardDebitDto,
} from 'src/dto/create-cards.dto';
import { UpdateCardDto } from 'src/dto/update-cards.dto';
import { CardsGuard } from './cards.guard';

@Controller('cards')
export class CardsController {
  constructor(private cardsServices: CardsService) {}
  @UseGuards(CardsGuard)
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
  @Patch('/one/:id')
  UpdateCard(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsServices.UpdateCard(id, updateCardDto);
  }

  @Post()
  createCards(@Body() newCard: CreateCardDto) {
    return this.cardsServices.createCards(newCard);
  }
}
