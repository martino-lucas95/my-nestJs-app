import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // 📘 Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('MyApp API')
    .setDescription('Documentación de la API Gateway')
    .setVersion('1.0')
    .addTag('clients')
    .addTag('invoices')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 Gateway corriendo en http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log('📘 Swagger disponible en http://localhost:3000/api');
}
bootstrap();
