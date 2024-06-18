import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateRemindersDto } from 'src/dto/create-reminders.dto';
import { UpdateReminderDto } from 'src/dto/update-reminders.dto';

@Controller('reminders')
export class RemindersController {
  constructor(private remindersServices: RemindersService) {}

  @Post()
  createReminders(@Body() reminder: CreateRemindersDto) {
    return this.remindersServices.createReminders(reminder);
  }
  @Delete('/:id')
  deleteTransaction(@Param('id') id: string) {
    return this.remindersServices.deleteReminder(id);
  }
  @Get('/:id')
  getAllRemindersForUser(@Param('id') id: string) {
    return this.remindersServices.getAllRemindersForUser(id);
  }
  @Patch('/:id')
  updateNameReminder(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersServices.updateNameReminder(id, updateReminderDto);
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
