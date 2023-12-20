import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
    constructor(private _image:ImageService){ 
    }
    @Post()
     @UseInterceptors(FileInterceptor('file'))
   async uploadImage(@UploadedFiles() file:Express.Multer.File){
       
        await this._image.upload(file.originalname,file.buffer)
    }
}
