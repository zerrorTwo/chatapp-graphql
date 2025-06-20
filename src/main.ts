import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from './config/cors/cors.options';
import { helmetConfig } from './config/helmet/helmet.options';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'; // Correct import
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GraphQLErrorFilter } from './filters/custom-exception.filter'; // Import the filter

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsOptions);
  app.use(helmet(helmetConfig));
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = Object.values(error.constraints!).join(
            ', ',
          );
          return accumulator;
        }, {});
        return new BadRequestException(formattedErrors);
      },
    }),
  );
  app.useGlobalFilters(new GraphQLErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
