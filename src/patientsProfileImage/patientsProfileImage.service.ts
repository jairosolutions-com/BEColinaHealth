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
  ) { }
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

  // Function to upload or update profile image
  async UpdateProfileImage(patientUuid: string, imageBuffer: Buffer, filename: string): Promise<void> {
    const patient = await this.getPatientByUuid(patientUuid);
    if (!patient) {
      throw new NotFoundException(`Patient with UUID ${patientUuid} not found`);
    }
  
    try {
      // Soft delete all existing profile images associated with the patient ID
      await this.softDeleteAllProfileImages(patient.id);
  
      // Upload the new profile image
      await this.uploadProfileImage(imageBuffer, filename, patient.id);
      
      console.log(`Profile image uploaded successfully for patient ID ${patient.id}`);
    } catch (error) {
      // Handle errors appropriately
      throw new Error(`Failed to update profile image for patient ID ${patient.id}: ${error.message}`);
    }
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

  async getProfileImagesByUuids(patientUuids: string[]): Promise<any[]> {
    const profileImages: any[] = [];
    for (const patientUuid of patientUuids) {
      // Find patient by UUID
      const patient = await this.patientsRepository.findOne({ where: { uuid: patientUuid } });
      if (!patient) {
        throw new NotFoundException(`Patient with UUID ${patientUuid} not found`);
      }

      // Fetch profile image by patient ID
      const profileImage = await this.getProfileImageByPatientId(patient.id);

      // Check if profile image is null or empty
      if (profileImage && profileImage.data) {
        // Include patient UUID in profile image data
        profileImages.push({
          patientUuid: patient.uuid,
          img_uuid: profileImage.img_uuid,
          filename: profileImage.filename,
          data: profileImage.data,
        });
      } else {
        // If profile image is null or empty, push an empty object
        profileImages.push({
          patientUuid: patient.uuid,
          img_uuid: null,
          filename: null,
          data: null,
        });
      }
    }
    return profileImages;
  }
  async getAllProfileImagesByPatientId(patientId: number): Promise<PatientsProfileImage[]> {
    try {
      // Query the database to find all profile images associated with the given patient ID
      const profileImages = await this.profileImageRepository.find({ where: { patientId } });
      return profileImages;
    } catch (error) {
      // Handle errors appropriately
      throw new Error(`Failed to retrieve profile images for patient ID ${patientId}: ${error.message}`);
    }
  }

  async softDeleteAllProfileImages(patientId: number): Promise<void> {
    try {
      // Find all profile images associated with the patient ID
      const existingProfileImages = await this.getAllProfileImagesByPatientId(patientId);
      
      // Soft delete each profile image
      for (const profileImage of existingProfileImages) {
        profileImage.deletedAt = new Date().toISOString();
        await this.profileImageRepository.save(profileImage);
      }
      
      console.log(`Soft deleted ${existingProfileImages.length} profile images for patient ID ${patientId}`);
    } catch (error) {
      // Handle errors appropriately
      throw new Error(`Failed to soft delete profile images for patient ID ${patientId}: ${error.message}`);
    }
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

  // private async updateProfileImageByPatientId(patientId: number, imageBuffer: Buffer, filename: string) {
  //   const existingProfileImage = await this.profileImageRepository.findOne({
  //     where: { patientId: patientId },
  //   });
  //   if (!existingProfileImage) {
  //     throw new BadRequestException(`No existing profile image found for patient ID ${patientId}`);
  //   }
  //   existingProfileImage.data = imageBuffer;
  //   existingProfileImage.filename = filename;
  //   const updatedProfileImage = await this.profileImageRepository.save(existingProfileImage);
  //   if (!updatedProfileImage) {
  //     throw new BadRequestException(`Failed to update profile image for patient ID ${patientId}`);
  //   }
  //   console.log(`Profile image updated successfully: ${updatedProfileImage}`);
  //   return updatedProfileImage;
  // }
  // Function to upload or update profile image
  // async uploadOrUpdateProfileImage(patientUuid: string, imageBuffer: Buffer, filename: string): Promise<void> {
  //   const patient = await this.getPatientByUuid(patientUuid);
  //   if (!patient) {
  //     throw new NotFoundException(`Patient with UUID ${patientUuid} not found`);
  //   }

  //   // Soft delete any existing profile image
  //   await this.softDeleteProfileImage(patientUuid);

  //   // Upload the new profile image
  //   await this.uploadProfileImage(imageBuffer, filename, patient.id);
  //   console.log(`Profile image uploaded successfully for patient ID ${patient.id}`);
  // }
}
