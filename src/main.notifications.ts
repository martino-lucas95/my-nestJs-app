import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications/notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    {
      transport: Transport.REDIS,
      options: { host: '127.0.0.1', port: 6379 },
    },
  );

  await app.listen();
  console.log('🔔 Microservicio de notificaciones escuchando en Redis');
}
bootstrap();
