import {BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {extname} from 'path';

export function getFileValidator(): PipeTransform {
 return new ParseFilePipeDocument();
}
//single file check
// @Injectable()
// export class ParseFilePipeDocument implements PipeTransform {
//  private readonly allowedExtensions = [ '.png', '.pdf', '.jpeg', '.jpg'];
 
//  transform(value: Express.Multer.File): Express.Multer.File {
//     if (!value) {
//         throw new BadRequestException('No file uploaded');
//     }

//     const extension = extname(value.originalname);  if(!this.allowedExtensions.includes(extension)) {
//    throw new BadRequestException(`File type ${extension} not supported`);
//   }
//   return value;
//  }
@Injectable()
export class ParseFilePipeDocument implements PipeTransform {
    private readonly allowedExtensions = ['.png', '.pdf', '.jpeg', '.jpg'];

    transform(files: Array<Express.Multer.File>): Array<Express.Multer.File> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        // Validate each file in the array
        files.forEach((file) => {
            if (!file) {
                throw new BadRequestException('One or more files are undefined');
            }
            
            const extension = extname(file.originalname);
            if (!this.allowedExtensions.includes(extension)) {
                throw new BadRequestException(`File type ${extension} not supported`);
            }
        });

        return files;
    }
}

