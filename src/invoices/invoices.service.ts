import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class InvoicesService {
  private invoices = [];

  private notificationsClient: ClientProxy;

  constructor() {
    this.notificationsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 8889 },
    });
  }

  createInvoice(data: any) {
    const invoice = {
      id: Date.now(),
      clientId: data.clientId,
      amount: data.amount,
      date: new Date().toISOString(),
    };

    this.invoices.push(invoice);
    console.log('✅ Factura creada:', invoice);

    this.notificationsClient.emit('invoice.created', invoice);

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
