import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    @Inject('INVOICES_CLIENT') private readonly invoicesClient: ClientProxy,
  ) {}

  @Post(':id/invoice')
  async createInvoice(@Param('id') id: string, @Body('amount') amount: number) {
    const response = await firstValueFrom(
      this.invoicesClient.send(
        { cmd: 'create_invoice' },
        { clientId: +id, amount },
      ),
    );
    return response;
  }

  @Get()
  getAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Post()
  createClient(@Body() client: CreateClientDto) {
    return this.clientsService.create(client);
  }

  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.clientsService.delete(+id);
  }

  @Get(':id/invoices')
  async listInvoicesByClient(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.invoicesClient.send(
        { cmd: 'list_invoices_by_client' },
        { clientId: +id },
      ),
    );
    return response;
  }

  @Get('invoice/:id')
  async getInvoice(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.invoicesClient.send({ cmd: 'get_invoice' }, { id: +id }),
    );
    return response;
  }
}
