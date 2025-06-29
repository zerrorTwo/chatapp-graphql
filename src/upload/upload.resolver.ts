import { Resolver, Mutation, Args } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { UploadService } from './upload.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

// @UseGuards(AuthGuard)
@Resolver()
export class UploadResolver {
  constructor(private readonly fileUploadService: UploadService) {}

  @Mutation(() => String)
  async uploadAvatar(
    @Args('file', { type: () => GraphQLUpload }) file: GraphQLUpload,
  ) {
    const result = await this.fileUploadService.uploadFile(file, 'avatar');
    return result.secure_url;
  }

  @Mutation(() => String)
  async uploadImage(
    @Args('file', { type: () => GraphQLUpload }) file: GraphQLUpload,
  ) {
    const result = await this.fileUploadService.uploadFile(file, 'image');
    return result.secure_url;
  }

  @Mutation(() => String)
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) file: GraphQLUpload,
  ) {
    const result = await this.fileUploadService.uploadFile(file, 'file');
    return result.secure_url;
  }
}
