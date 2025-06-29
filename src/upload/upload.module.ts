import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';
import { UploadResolver } from './upload.resolver';

@Module({
  providers: [UploadResolver, UploadService, ConfigService],
})
export class UploadModule {}
