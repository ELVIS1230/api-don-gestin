import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Accounts } from './accounts.entity';
import { Cards } from 'src/cards/cards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Accounts])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
