import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { ApiKeyGuard } from './auth/api-key/api-key.guard';
import { AllergiesModule } from './allergies/allergies.module';
import { SurgeriesModule } from './surgeries/surgeries.module';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { EmergencyContactsModule } from './emergencyContacts/emergencyContacts.module';
import { LabResultsModule } from './labResults/labResults.module';
import { MedicationLogsModule } from './medicationLogs/medicationLogs.module';
import { NotesModule } from './notes/notes.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { RolesModule } from './roles/roles.module';
import { UserAccessLevelsModule } from './userAccessLevels/userAccessLevels.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { VitalSignsModule } from './vitalSigns/vitalSigns.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsModule } from '../services/cronjobs/cronjobs.module';
import { CountryModule } from './countries/countries.module';
import { LabResultsFilesModule } from './labResultsFiles/labResultsFiles.module';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { PrescriptionFilesModule } from './prescriptionsFiles/prescriptionsFiles.module';

import { FormsModule } from './forms/forms.module';
import { FormFilesModule } from './formFiles/formFiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.local' }),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT, 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      autoLoadEntities: true, // Automatically load entities without the need for the entities array
      ssl: true,
    }),
    UsersModule,
    RolesModule,
    UserAccessLevelsModule,
    PatientsModule,
    MedicationLogsModule,
    VitalSignsModule,
    LabResultsModule,
    NotesModule,
    AppointmentsModule,
    EmergencyContactsModule,
    CompaniesModule,
    CountryModule,
    AuthModule,
    PrescriptionsModule,
    AllergiesModule,
    SurgeriesModule,
    CronjobsModule,
    PrescriptionFilesModule,
    LabResultsFilesModule,
    FormsModule,
    FormFilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
