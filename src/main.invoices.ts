import { NestFactory } from '@nestjs/core';
import { InvoicesModule } from './invoices/invoices.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InvoicesModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8888,
      },
    },
  );
  await app.listen();
  console.log('🧾 Microservicio de facturas escuchando en puerto 8888');
}
bootstrap();
