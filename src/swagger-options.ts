import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('NELLCORP CHALLENGE')
  .setDescription('The API for the NellCorp Challenge')
  .setVersion('1.0')
  .build();
