import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IdService {
  generateRandomUUID(prefix: string): string {
    // Generate a Version 4 (random) UUID
    const randomUUID = uuidv4();

    // Add the prefix to the UUID
    const prefixedUUID = prefix + randomUUID.substring(0, 8);

    return prefixedUUID;
  }
}
