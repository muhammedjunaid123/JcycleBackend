import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {

    private readonly s3Client = new S3Client({
        region: process.env.aws_s3_region,
        credentials: {
            accessKeyId: process.env.aws_key_id,
            secretAccessKey: process.env.aws_pass,
        }
       
      });
    
      constructor(private readonly configService: ConfigService) {}
    
      async upload(fileName: string, file: Buffer) {
        console.log(fileName,file);
        console.log(this.configService.getOrThrow('aws_s3_region'));
        
        try {
            await this.s3Client.send(
                new PutObjectCommand({    
                  Bucket:'jcyclefiles',
                  Key: fileName,
                  Body: file,
                }),
              );
        } catch (error) {
            console.log(error);
            
        }
        
       
      }
}
