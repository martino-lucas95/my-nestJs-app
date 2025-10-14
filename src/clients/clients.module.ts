import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import {
  ClientsModule as ClientsTcpModule,
  Transport,
} from '@nestjs/microservices';

@Module({
  imports: [
    ClientsTcpModule.register([
      {
        name: 'INVOICES_CLIENT',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 8888 },
      },
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
