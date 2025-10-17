import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    @Inject('INVOICES_CLIENT') private readonly invoicesClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.clientsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createClient(@Body() client: CreateClientDto) {
    return this.clientsService.create(client);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.clientsService.delete(+id);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('invoice/:id')
  async getInvoice(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.invoicesClient.send({ cmd: 'get_invoice' }, { id: +id }),
    );
    return response;
  }
}
