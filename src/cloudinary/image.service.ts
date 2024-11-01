import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream((error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
