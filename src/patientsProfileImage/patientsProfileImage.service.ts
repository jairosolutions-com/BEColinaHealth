import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientsProfileImage } from './entities/patientsProfileImage.entity';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class PatientsProfileImageService {
  constructor(
    @InjectRepository(PatientsProfileImage)
    private profileImageRepository: Repository<PatientsProfileImage>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    private idService: IdService,
  ) {}
// FUNCTIONS FOR FILES CRUD UUID SERVICE

  async addProfileImage(patientUuid: string, imageBuffer: Buffer, filename: string) {
    const patient = await this.getPatientByUuid(patientUuid);
    if (!patient) {
      throw new NotFoundException(`Patient with UUID ${patientUuid} not found`);
    }

    const profileImage = await this.uploadProfileImage(imageBuffer, filename, patient.id);
    return profileImage;
  }

  async getProfileImageByUuid(patientUuid: string) {
    const patient = await this.getPatientByUuid(patientUuid);
    if (!patient) {
      throw new NotFoundException(`Patient with UUID ${patientUuid} not found`);
    }

    const profileImage = await this.getProfileImageByPatientId(patient.id);
    return profileImage;
  }

  async updateProfileImage(patientUuid: string, imageBuffer: Buffer, filename: string) {
    const patient = await this.getPatientByUuid(patientUuid);
    if (!patient) {
      throw new NotFoundException(`Patient with UUID ${patientUuid} not found`);
    }

    const updatedProfileImage = await this.updateProfileImageByPatientId(patient.id, imageBuffer, filename);
    return updatedProfileImage;
  }

  async getCurrentImageCountFromDatabase(patientUuid: string): Promise<number> {
    const patient = await this.getPatientByUuid(patientUuid);
    if (!patient) {
      throw new NotFoundException(`Patient with UUID ${patientUuid} not found`);
    }

    const profileImage = await this.getProfileImageByPatientId(patient.id);
    return profileImage ? 1 : 0;
  }

  private async getPatientByUuid(patientUuid: string): Promise<Patients> {
    const patient = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    return patient;
  }
  async softDeleteProfileImage(patientUuid: string): Promise<void> {
    const patient = await this.getPatientByUuid(patientUuid);
    if (!patient) {
      throw new NotFoundException(`Patient with UUID ${patientUuid} not found`);
    }

    const profileImage = await this.getProfileImageByPatientId(patient.id);
    if (!profileImage) {
      return; // Profile image not found, no need to delete
    }

    profileImage.deletedAt = new Date().toISOString();
    await this.profileImageRepository.save(profileImage);
  }
// FUNCTIONS FOR FILES CRUD ID SERVICE
  private async uploadProfileImage(imageBuffer: Buffer, filename: string, patientId: number) {
    const newImage = await this.profileImageRepository.create({
      img_uuid: this.idService.generateRandomUUID("IMG-"),
      patientId: patientId,
      filename,
      data: imageBuffer,
    });
    await this.profileImageRepository.save(newImage);
    return newImage;
  }

  private async getProfileImageByPatientId(patientId: number) {
    const image = await this.profileImageRepository.findOne({
      where: { patientId: patientId },
    });
    return image;
  }

  private async updateProfileImageByPatientId(patientId: number, imageBuffer: Buffer, filename: string) {
    const existingProfileImage = await this.profileImageRepository.findOne({
      where: { patientId: patientId },
    });
    if (!existingProfileImage) {
      throw new BadRequestException(`No existing profile image found for patient ID ${patientId}`);
    }
    existingProfileImage.data = imageBuffer;
    existingProfileImage.filename = filename;
    const updatedProfileImage = await this.profileImageRepository.save(existingProfileImage);
    if (!updatedProfileImage) {
      throw new BadRequestException(`Failed to update profile image for patient ID ${patientId}`);
    }
    console.log(`Profile image updated successfully: ${updatedProfileImage}`);
    return updatedProfileImage;
  }
}
