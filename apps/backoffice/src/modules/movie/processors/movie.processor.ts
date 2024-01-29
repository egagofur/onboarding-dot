import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueError,
    Process,
    Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Utils } from 'apps/backoffice/src/common/utils/util';
import { Logger } from '@nestjs/common';

@Processor('image-upload-queue')
export class FileUploadProcessor {
    @OnQueueActive()
    onActive(job: Job) {
        Logger.log(
            `Processing job ${job.id} of type ${job.name}.`,
            'FileUploadProcessor',
        );
    }

    @OnQueueError()
    onError(error: Error) {
        Logger.error(
            `Error processing job: ${error.message}`,
            'FileUploadProcessor',
        );
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        Logger.log(
            `Completed job ${job.id} of type ${job.name}.`,
            'FileUploadProcessor',
        );
    }

    @Process('upload-file')
    async processUpload(job: Job): Promise<void> {
        try {
            const file = job.data.file;
            const ext = file.mimetype.split('/')[1];

            const fileName = `${file.originalname.split('.')[0]}-${
                Date.now() + Math.round(Math.random() * 1e9)
            }.${ext}`;

            const destPath = 'uploads/' + fileName;
            const nameFile = await Utils.moveFile(file.path, destPath);
            Logger.log(nameFile, 'FileUploadProcessor');
            console.log('[ Queue upload file berhasil ] - Success ', nameFile);
        } catch (error) {
            Logger.error(error, 'FileUploadProcessor');
            console.log('[ Queue upload file gagal ] - Error ', error);
        }
    }
}
