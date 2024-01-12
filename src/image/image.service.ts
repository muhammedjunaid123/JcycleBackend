import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
@Injectable()
export class ImageService {

  async upload(
    files: Array<Express.Multer.File>,
  ): Promise<Array<UploadApiResponse | UploadApiErrorResponse>> {
    try {
      const uploadPromises: Promise<
        UploadApiResponse | UploadApiErrorResponse
      >[] = [];
      files.forEach((file) => {
        const promise = new Promise<UploadApiResponse | UploadApiErrorResponse>(
          (resolve, reject) => {
            const upload = v2.uploader.upload_stream(
              { folder: 'jcycle' },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              },
            );
            toStream(file.buffer).pipe(upload);
          },
        );

        uploadPromises.push(promise);
      });

      return Promise.all(uploadPromises);
    } catch (error) {
      console.log(error);
      
     throw new HttpException(
        'there was some issue with the image please try again',
        HttpStatus.BAD_REQUEST
     )  
    }
  }
}

