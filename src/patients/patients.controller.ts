import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CreatePatientsInput } from './dto/create-patients.input';
import { UpdatePatientsInput } from './dto/update-patients.input';
import { PatientsService } from './patients.service';
import { PatientsProfileImageService } from '../patientsProfileImage/patientsProfileImage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Patients } from './entities/patients.entity';

@Controller('patient-information')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly profileImageService: PatientsProfileImageService,
  ) {}

  @Post('list')
  getPatientsByTerm(
    @Body()
    requestData: {
      term: string;
      page: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    },
  ): Promise<{
    data: Patients[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const { term = '', page, sortBy, sortOrder } = requestData;
    return this.patientsService.getAllPatientsBasicInfo(
      term,
      page,
      sortBy,
      sortOrder,
    );
  }

  @Get('select')
  getAllPatientsFullName() {
    return this.patientsService.getAllPatientsFullName();
  }

  @Get('overview/:id')
  getPatientOverviewById(@Param('id') id: string) {
    return this.patientsService.getPatientOverviewById(id);
  }
  @Get('fullInfo/:id')
  getPatientFullInfoById(@Param('id') id: string) {
    return this.patientsService.getPatientFullInfoById(id);
  }
  // POST /patient-information
  @Post()
  createPatient(@Body() createPatientsInput: CreatePatientsInput) {
    return this.patientsService.createPatients(createPatientsInput);
  }
  // PATCH /patient-information/{id}
  @Patch('update/:id')
  updatePatientInfo(
    @Param('id') id: string,
    @Body() updatePatientsInput: UpdatePatientsInput,
  ) {
    return this.patientsService.updatePatients(id, updatePatientsInput);
  }

  @Patch('delete/:id')
  softDeletePatient(@Param('id') id: string) {
    return this.patientsService.softDeletePatient(id);
  }

  //patient files
  @Post(':id/upload-profile-image')
  @UseInterceptors(FileInterceptor('profileimage'))
  async addProfileImage(
    @Param('id') patientUuid: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { buffer, originalname } = file;
    return await this.profileImageService.addProfileImage(
      patientUuid,
      buffer,
      originalname,
    );
  }

  @Patch(':id/update-profile-image')
  @UseInterceptors(FileInterceptor('profileimage'))
  async updateProfileImage(
    @Param('id') patientUuid: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { buffer, originalname } = file;

    try {
      // Call the service method to update profile image
      await this.profileImageService.UpdateProfileImage(
        patientUuid,
        buffer,
        originalname,
      );
      return { success: true, message: 'Profile image updated successfully.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  //for patient list
  @Post('profile-images')
  async getProfileImagesByUuids(@Body() body: { patientUuids: string[] }) {
    if (!body.patientUuids || body.patientUuids.length === 0) {
      throw new BadRequestException(
        'Please provide patient UUIDs in the request body',
      );
    }

    const profileImages =
      await this.profileImageService.getProfileImagesByUuids(body.patientUuids);
    return profileImages;
  }

  @Get(':id/profile-image')
  async getProfileImage(@Param('id') patientUuid: string) {
    return await this.profileImageService.getProfileImageByUuid(patientUuid);
  }

  @Get(':id/profile-image/count')
  async getCurrentProfileImageCount(@Param('id') patientUuid: string) {
    return await this.profileImageService.getCurrentImageCountFromDatabase(
      patientUuid,
    );
  }
}
