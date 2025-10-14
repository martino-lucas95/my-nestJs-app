import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InvoicesService {
  constructor(private eventEmitter: EventEmitter2) {}

  private invoices = [];

  createInvoice(data: any) {
    const invoice = {
      id: Date.now(),
      clientId: data.clientId,
      amount: data.amount,
      date: new Date().toISOString(),
    };

    this.invoices.push(invoice);
    console.log('✅ Factura creada:', invoice);

    this.eventEmitter.emit('invoice.created', invoice);

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
