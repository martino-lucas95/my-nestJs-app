import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class InvoicesService {
  private invoices = [];

  @MessagePattern({ cmd: 'create_invoice' })
  createInvoice(data: any) {
    const invoice = {
      id: Date.now(),
      clientId: data.clientId,
      amount: data.amount,
      date: new Date().toISOString(),
    };

    this.invoices.push(invoice);
    console.log('✅ Factura creada:', invoice);
    return { message: 'Factura creada', invoice };
  }

  @MessagePattern({ cmd: 'list_invoices' })
  listInvoices() {
    return this.invoices;
  }

  @MessagePattern({ cmd: 'get_invoice' })
  getInvoice(data: { id: number }) {
    const invoice = this.invoices.find((inv) => inv.id === data.id);
    if (!invoice) {
      return { message: 'Factura no encontrada' };
    }
    return invoice;
  }
}
