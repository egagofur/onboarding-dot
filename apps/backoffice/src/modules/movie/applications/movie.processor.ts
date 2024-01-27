import { Process, Processor } from '@nestjs/bull';
import { ImageUploadService } from '../../auth/services/image-upload.services';
import { Job } from 'bull';
import { Utils } from 'apps/backoffice/src/common/utils/util';

@Processor('image-upload-queue')
export class FileUploadProcessor {
    constructor(private readonly imageUploadService: ImageUploadService) {}

    @Process('upload-file')
    async processUpload(job: Job) {
        try {
            const file = job.data.file;
            const ext = file.mimetype.split('/')[1];

            const fileName = `${file.originalname.split('.')[0]}-${
                Date.now() + Math.round(Math.random() * 1e9)
            }.${ext}`;

            const destPath = 'uploads/' + fileName;
            const nameFile = await Utils.moveFile(file.path, destPath);
            console.log('[ Queue upload file berhasil ] - Success ', nameFile);
        } catch (error) {
            console.log('[ Queue upload file gagal ] - Error ', error);
        }
    }
}
