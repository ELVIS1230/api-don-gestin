import { Body, Controller, Get, Post } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateRemindersDto } from 'src/dto/create-reminders.dto';

@Controller('reminders')
export class RemindersController {
  constructor(private remindersServices: RemindersService) {}

  @Post()
  createReminders(@Body() reminder: CreateRemindersDto) {
    return this.remindersServices.createReminders(reminder);
  }

  @Get()
  getAllReminders() {
    return this.remindersServices.getAllReminders();
  }

  @Get('/date')
  getRemindersForDate() {
    return this.remindersServices.verifyReminders();
  }
}
