import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Redis } from 'ioredis';

@Injectable()
export class InvoicesService {
  private invoices = [];
  private notificationsClient: ClientProxy;
  private redisStreamClient: Redis;

  constructor() {
    // Pub/Sub (para notificaciones)
    this.notificationsClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: { host: '127.0.0.1', port: 6379 },
    });

    // Streams (para persistencia)
    this.redisStreamClient = new Redis({ host: '127.0.0.1', port: 6379 });
  }

  async createInvoice(data: any) {
    const invoice = {
      id: Date.now(),
      clientId: data.clientId,
      amount: data.amount,
      date: new Date().toISOString(),
    };

    this.invoices.push(invoice);
    console.log('✅ Factura creada:', invoice);

    // 1️⃣ Publicar en canal Pub/Sub
    this.notificationsClient.emit('invoice.created', invoice);

    // 2️⃣ Agregar al Stream persistente
    await this.redisStreamClient.xadd(
      'invoice.stream', // nombre del stream
      '*', // auto-timestamp
      'data',
      JSON.stringify(invoice),
    );
    return { message: 'Factura creada', invoice };
  }

  listInvoices() {
    return this.invoices;
  }

  listInvoicesByClient(data: { clientId: number }) {
    return this.invoices.filter((inv) => inv.clientId === data.clientId);
  }

  getInvoice(data: { id: number }) {
    const invoice = this.invoices.find((inv) => inv.id === data.id);
    if (!invoice) {
      return { message: 'Factura no encontrada' };
    }
    return invoice;
  }
}
