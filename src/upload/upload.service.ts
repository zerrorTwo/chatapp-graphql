import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: GraphQLUpload,
    folder: 'avatar' | 'image' | 'file',
  ): Promise<UploadApiResponse> {
    const { createReadStream, filename } = file;
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `uploads/${folder}`,
          allowed_formats: ['jpg', 'png', 'pdf'],
          public_id: filename.split('.')[0],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error); // Thêm log lỗi
            reject(error);
          } else if (result) {
            console.log('Cloudinary upload success:', result.secure_url); // Thêm log thành công
            resolve(result);
          } else {
            console.error('Upload failed: result is undefined'); // Thêm log lỗi
            reject(new Error('Upload failed: result is undefined'));
          }
        },
      );
      createReadStream().pipe(uploadStream);
    });
  }
}
