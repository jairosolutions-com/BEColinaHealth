import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { CompanyModule } from './company/company.module';
import { EmergencyContactModule } from './emergency_contact/emergency_contact.module';
import { LabResultsModule } from './lab_results/lab_results.module';
import { MedicalHistoryModule } from './medical_history/medical_history.module';
import { MedicationModule } from './medication/medication.module';
import { NotesModule } from './notes/notes.module';
import { PatientInformationModule } from './patient_information/patient_information.module';
import { RoleModule } from './role/role.module';
import { UserAccessLevelModule } from './user_access_level/user_access_level.module';
import { UsersModule } from './users/users.module';
import { VitalSignsModule } from './vital_signs/vital_signs.module';

@Module({
  imports: [AppointmentModule, CompanyModule, EmergencyContactModule, LabResultsModule, MedicalHistoryModule, MedicationModule, NotesModule, PatientInformationModule, RoleModule, UserAccessLevelModule, UsersModule, VitalSignsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
