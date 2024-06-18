import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminders } from './reminders.entity';
import { Repository } from 'typeorm';
import { CreateRemindersDto } from 'src/dto/create-reminders.dto';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.entity';
import * as dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateReminderDto } from 'src/dto/update-reminders.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminders)
    private remindersRepository: Repository<Reminders>,
    private usersService: UsersService,
    private mailerService: MailerService,
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

    for (const reminder of reminders) {
      await this.mailerService.sendMail({
        from: `"Don Gestin" <elcochineytor@gmail.com>`,
        to: `${reminder.u_cedula_fk.u_email}`,
        subject: `Don gestin: ${reminder.remind_name}`,
        html: `
          <html>
          <head>
          <style>

          .contenedor-email{
                  font-family:Arial;
                  margin: 0 auto;
                  border: 4px solid black;
                  border-radius: 25px ;
                  width: 450px;
                  padding: 15px 15px 15px 15px ;
              }
           
          .contenedor-icono .icono{
              font-weight: 800;
              font-size: 20px;
              margin: 0;
          }
          .contenedor-icono .icono span{
              font-weight: 500;
          
          }
          .linea {
              width: 45px;
              height: 5px;
              background: black;
              position: absolute;
              border-radius: 20px;
          
          }
          .contenedor-titulo h1{
              text-align: center;
              margin: 25px 0 0 0 ;
              font-weight: 900;
              font-family:Tahoma ;
      
      
          }
          .linea2 {
              width: 450px;
              height: 5px;
              margin-bottom: 30px;
              background: black;
              border-radius: 20px;
          
          }
              .nombre span{
                  font-weight: 800;
              }
              .contenedor-recordatorio{
                  border: 2px solid black;
                  border-radius: 15px;
                  padding: 0px 0px 5px 20px;
              }
              .contenedor-recordatorio h1{
              font-weight: 900;
              margin: 8px 0 0 0 ;
              font-family:Tahoma ;

      
              }
              .contenedor-recordatorio h4{
                  font-weight: 700;
              }
              .contenedor-recordatorio h4,.contenedor-recordatorio p{
                  margin-left: 25px;
      
              }
              .center{
                  text-align: center;
              }
          </style>
          </head>
          <body>
          </style>
    <div class="body">
        <div class="contenedor-email">
            <div class="contenedor-icono">
                <p class="icono">Don <span> Gestin</span></p>
                <div class="linea"></div>
            </div>
            <div class="contenedor-titulo">
                <h1 class="titulo">Recordatorio Pago </h1>
                <div class="linea2"></div>
            </div>
            <div class="contenedor-parrafos">
            <p class="nombre">Sr/a <span>${reminder.u_cedula_fk.u_name} ${reminder.u_cedula_fk.u_lastname}</span> se le notifica que usted creó un recordatorio en la aplicación 
            <span>Don Gestin</span> para realizar algún pago</p>
                <p class="center">El recordatorio que usted creo es:</p>
            </div>

            
            <div class="contenedor-recordatorio">
            <h1>${reminder.remind_name}</h1>
                <h4>Descripcion:</h4>
                <p>${reminder.remind_description}</p>
            </div>
        </div>
    </div>
        </body>
        </html>`,
      });
      await this.updateDateReminder(reminder.remind_id);
    }
    return reminders;
  }

  async updateDateReminder(reminderID: string) {
    // El formato de la fecha deberia ser 'YYYY-MM-DD'
    const reminderFound = (await this.getReminder(reminderID)) as Reminders;
    const updateCardDate = dayjs(reminderFound.remind_date, 'MM-DD-YYYY')
      .add(1, 'month')
      .format('MM-DD-YYYY');
    reminderFound.remind_date = updateCardDate;
    return await this.remindersRepository.save(reminderFound);
  }
  async updateNameReminder(reminderID: string, updateReminderDto: UpdateReminderDto ) {
    return await this.remindersRepository.update(reminderID,{
      remind_name: updateReminderDto.name,
      remind_description: updateReminderDto.description,
      }
    )
  }

  async getRemindersForDate() {
    // El formato de la fecha deberia ser 'YYYY-MM-DD'
    const today = dayjs().format('MM-DD-YYYY');
    console.log(today);
    const remindersFound = await this.remindersRepository.find({
      where: { remind_date: today },
      relations: ['u_cedula_fk'],
    });
    console.log(remindersFound);
    return remindersFound
      ? remindersFound
      : new HttpException(
          'Hubo un error en encontrar los recordatorios ',
          HttpStatus.CONFLICT,
        );
  }

  async getReminder(reminderID: string) {
    const reminderFound = await this.remindersRepository.findOne({
      where: { remind_id: reminderID },
    });
    return reminderFound;
    // ? reminderFound
    // : new HttpException(
    //     'Hubo un error en encontrar los recordatorios ',
    //     HttpStatus.CONFLICT,
    //   );
  }
  // async getAllReminders() {
  //   const remindersFound = (await this.remindersRepository.find()) as Reminders[];
  //   return remindersFound;
  // }
  async deleteReminder(reminderID: string) {
    const remindersDelete = this.remindersRepository.delete(reminderID);
    return remindersDelete;
  }
  async getAllRemindersForUser(cedula: string) {
    const remindersFound = (await this.remindersRepository.find({
      where: { u_cedula_fk: { u_cedula: cedula } },
      order: { remind_date: 'DESC' },
    })) as Reminders[];
    return remindersFound;
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
      remind_id: reminderID,
    });

    console.log(reminder);
    return await this.remindersRepository.save(newReminder);
  }

  createIDReminder(cedula: string, numberReminder: number) {
    const reminderID = cedula.substring(0, 6) + 'RECORD' + numberReminder;
    return reminderID;
  }
}
