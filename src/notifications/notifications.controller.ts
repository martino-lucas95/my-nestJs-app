import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  @EventPattern('invoice.created')
  handleInvoiceCreated(data: any) {
    this.logger.log(
      `📢 Nueva factura creada: Cliente ${data.clientId}, Monto: ${data.amount}`,
    );
  }
}
