import { type CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const CorsOptions: CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-apollo-operation-name'],
  credentials: true,
  maxAge: 86400,
};

export { CorsOptions };
