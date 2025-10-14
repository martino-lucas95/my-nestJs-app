import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @MessagePattern({ cmd: 'create_invoice' })
  createInvoice(data: any) {
    return this.invoicesService.createInvoice(data);
  }

  @MessagePattern({ cmd: 'list_invoices' })
  listInvoices() {
    return this.invoicesService.listInvoices();
  }

  @MessagePattern({ cmd: 'list_invoices_by_client' })
  listInvoicesByClient(data: { clientId: number }) {
    return this.invoicesService.listInvoicesByClient(data);
  }

  @MessagePattern({ cmd: 'get_invoice' })
  getInvoice(data: { id: number }) {
    return this.invoicesService.getInvoice(data);
  }
}
