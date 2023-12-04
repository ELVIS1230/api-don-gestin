import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminders } from './reminders.entity';
import { Repository } from 'typeorm';
import { CreateRemindersDto } from 'src/dto/create-reminders.dto';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminders)
    private remindersRepository: Repository<Reminders>,
    private usersService: UsersService,
  ) {}

  // private readonly logger = new Logger(RemindersService.name);

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async cardsEveryFiveSecond() {
  //   const fechaActual = new Date();
  //   this.logger.debug(`fecha actual ${fechaActual}`);
  //   await this.verifyCards();
  // }

  async verifyReminders() {
    const reminders = (await this.getRemindersForDate()) as Reminders[];
    for (const reminder of reminders){
      
    }
    return reminders;
    // if
  }

  async getRemindersForDate() {
    const today = dayjs().format('YYYY-MM-DD');
    // console.log(dateNow);
    const remindersFound = await this.remindersRepository.find({
      where: { record_fecha: today },
    });
    console.log(remindersFound);
    return remindersFound
      ? remindersFound
      : new HttpException(
          'Hubo un error en encontrar los recordatorios ',
          HttpStatus.CONFLICT,
        );
  }
  async getAllReminders() {
    const remindersFound = await this.remindersRepository.find();
    return remindersFound
      ? remindersFound
      : new HttpException(
          'Hubo un error en encontrar los recordatorios ',
          HttpStatus.CONFLICT,
        );
  }

  async createReminders(reminder: CreateRemindersDto) {
    const userFound = (await this.usersService.getUser(
      reminder.u_cedula_fk.u_cedula,
    )) as Users;
    const reminderID = this.createIDReminder(
      userFound.u_cedula,
      userFound.reminders.length,
    );
    const newReminder = this.remindersRepository.create({
      ...reminder,
      record_id: reminderID,
    });

    console.log(reminder);
    return await this.remindersRepository.save(newReminder);
  }

  createIDReminder(cedula: string, numberReminder: number) {
    const reminderID = cedula.substring(0, 6) + 'RECORD' + numberReminder;
    return reminderID;
  }
}
