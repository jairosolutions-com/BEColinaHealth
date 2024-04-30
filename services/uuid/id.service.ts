import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class IdService {
  generateRandomUUID(prefix: string): string {
    // Generate a Version 4 (random) UUID
    const randomUUID = uuid4();

    // Add the prefix to the UUID
    const prefixedUUID = prefix + randomUUID.substring(0, 8);

    const toUpperCasePrefixUUID = prefixedUUID.toUpperCase();

    return toUpperCasePrefixUUID;
  }
}
