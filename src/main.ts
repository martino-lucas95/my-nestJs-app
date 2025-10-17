import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === 'development') {
    app.use(
      ['/api', '/api-json'],
      basicAuth({
        challenge: true,
        users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
      }),
    );
    const config = new DocumentBuilder()
      .setTitle('My App API')
      .setDescription('Documentación de la API Gateway')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('clients')
      .addTag('invoices')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    console.log('📘 Swagger disponible en http://localhost:3000/api');
  } else {
    console.log('🚫 Swagger deshabilitado en modo producción');
  }
  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 Gateway corriendo en http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
