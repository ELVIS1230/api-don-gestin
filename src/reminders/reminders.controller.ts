import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  @Get('/date/:id')
  updateReminderDate(@Param('id') id: string) {
    return this.remindersServices.updateDateReminder(id);
  }
}
