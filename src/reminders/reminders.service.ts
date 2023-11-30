import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminders } from './reminders.entity';
import { Repository } from 'typeorm';
import { CreateRemindersDto } from 'src/dto/create-reminders.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminders)
    private remindersRepository: Repository<Reminders>,
    private usersService: UsersService,
  ) {}

  async createReminders(reminder: CreateRemindersDto) {
    const userFound = await this.usersService.getUser(
      reminder.u_cedula_fk.u_cedula,
    );
    console.log(userFound);
    console.log(reminder);
    return reminder.record_fecha;
  }
}
