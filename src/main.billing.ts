import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing/billing.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(BillingModule);
  console.log('🏦 Microservicio de facturación iniciado (Redis Streams)');
}

bootstrap();
