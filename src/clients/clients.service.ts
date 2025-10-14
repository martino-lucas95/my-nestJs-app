import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientsService {
  constructor(readonly config: ConfigService) {}

  private clients = [];

  findAll() {
    return this.clients;
  }

  findOne(id: number) {
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) {
      return { message: 'Cliente no encontrado' };
    }
    return this.clients[index];
  }

  create(client: any) {
    this.clients.push({ id: Date.now(), ...client });
    return { message: 'Cliente creado', total: this.clients.length };
  }

  update(id: number, client: any) {
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) {
      return { message: 'Cliente no encontrado' };
    }
    this.clients[index] = { id, ...client };
    return { message: 'Cliente actualizado', client: this.clients[index] };
  }

  delete(id: number) {
    const client = this.clients.find((c) => c.id === id);
    if (!client) return { message: 'Cliente no encontrado' };
    client.deleted = true;
    return { message: 'Cliente eliminado', client };
  }
}
