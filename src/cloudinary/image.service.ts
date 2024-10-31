import { Injectable } from '@nestjs/common';
import cloudinary from 'config/cloudinary/cloudinary.config';

@Injectable()
export class ImageService {

  constructor() {}

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }).end(file.buffer);
    });
  }
}
