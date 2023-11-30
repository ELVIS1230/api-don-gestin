import { Body, Controller, Post } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateRemindersDto } from 'src/dto/create-reminders.dto';

@Controller('reminders')
export class RemindersController {
  constructor(private remindersServices: RemindersService) {}

  @Post()
  createReminders(@Body() reminder: CreateRemindersDto) {
    this.remindersServices.createReminders(reminder);
  }
}
