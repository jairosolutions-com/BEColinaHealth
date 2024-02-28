import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IdService {
  generateRandomUUID(): string {
    // Generate a Version 4 (random) UUID
    const randomUUID = uuidv4();

    // Extract the first 9 characters of the UUID
    const truncatedUUID = randomUUID.substring(0, 8);

    return truncatedUUID;
  }
}
