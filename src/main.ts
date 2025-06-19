import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from './config/cors/cors.options';
import { helmetConfig } from './config/helmet/helmet.options';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsOptions);
  app.use(helmet(helmetConfig));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
