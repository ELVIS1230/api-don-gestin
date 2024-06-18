import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from './cards.entity';
import { UsersModule } from 'src/users/users.module';
import { CardsGuard } from './cards.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Cards]), UsersModule],
  controllers: [CardsController],
  providers: [CardsService, CardsGuard],
  exports: [CardsService],
})
export class CardsModule {}
