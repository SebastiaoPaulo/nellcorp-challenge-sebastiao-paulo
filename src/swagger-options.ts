import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('LAB-APP-API')
  .setDescription('The API for the LAB APP')
  .setVersion('1.0')
  .build();
