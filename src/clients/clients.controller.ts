import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    @Inject('INVOICES_CLIENT') private invoicesClient: ClientProxy,
  ) {}

  @Post(':id/invoice')
  async createInvoice(@Param('id') id: string, @Body('amount') amount: number) {
    const response = await this.invoicesClient
      .send({ cmd: 'create_invoice' }, { clientId: +id, amount })
      .toPromise();
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
}
