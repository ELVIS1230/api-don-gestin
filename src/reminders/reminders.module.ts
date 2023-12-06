import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminders } from './reminders.entity';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
// import { ResendModule } from 'nestjs-resend';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminders]),
    // ResendModule.forAsyncRoot({
    //   useFactory: async () => ({
    //     apiKey: process.env.RESEND_KEY,
    //   }),
    // }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'vladimirortiz1230@gmail.com',
          pass: 'elcochineytor3000              ',
        },
      },
    }),
    UsersModule,
  ],
  providers: [RemindersService],
  controllers: [RemindersController],
})
export class RemindersModule {}
