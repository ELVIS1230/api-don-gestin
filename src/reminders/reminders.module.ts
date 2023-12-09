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
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'elcochineytor@gmail.com',
          pass: 'seum wzhw zfoc nwet',
        },
      },
    }),
    UsersModule,
  ],
  providers: [RemindersService],
  controllers: [RemindersController],
})
export class RemindersModule {}
