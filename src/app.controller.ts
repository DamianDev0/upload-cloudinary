import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Controller()
export class AppController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 4, // 4MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    return this.cloudinaryService.uploadFile(file);
  }
}

//otra manera

// import {
//   Controller,
//   FileTypeValidator,
//   MaxFileSizeValidator,
//   ParseIntPipe,
//   Post,
//   UploadedFile,
//   UseInterceptors
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from './cloudinary/cloudinary.service';

// @Controller()
// export class AppController {
//   constructor(
//     private readonly appService: AppService,
//     private readonly cloudinaryService: CloudinaryService
//   ) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Express.Multer.File) {
//     new ParseIntPipe({
//       validators: [
//         new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
//         new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })
//       ]
//     });

//     if (!file) {
//       throw new BadRequestException('File is required!');
//     }

//     return this.cloudinaryService.uploadFile(file);
//   }
// }
