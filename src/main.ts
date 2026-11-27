import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable DTO validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out extra properties not in the DTO
      forbidNonWhitelisted: true
    })
  );

  // 2. Configure Swagger UI with JWT Bearer support
  const config = new DocumentBuilder()
    .setTitle('NestJS Auth & RBAC(Role Based Access Control) API')
    .setDescription('Step-by-Step Authentication & Authorization with SQLite')
    .setVersion('1.0')
    .addBearerAuth() // Adds the authorize padlock button
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application running on: http://localhost:3000');
  console.log('Swagger UI available at: http://localhost:3000/api');
}
await bootstrap();
