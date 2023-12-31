import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TransactionsModule } from './transactions/transactions.module';
import { CardsModule } from './cards/cards.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SavingsModule } from './savings/savings.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_RAILWAY_HOST,
      port: parseInt(<string>process.env.POSTGRES_RAILWAY_PORT),
      username: process.env.POSTGRES_RAILWAY_USERNAME,
      password: process.env.POSTGRES_RAILWAY_PASSWORD,
      database: process.env.POSTGRES_RAILWAY_DATABASE,
      // autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AppModule,
    TransactionsModule,
    CardsModule,
    ScheduleModule.forRoot(),
    SavingsModule,
    RemindersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
