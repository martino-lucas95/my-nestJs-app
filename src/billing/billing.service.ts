import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class BillingService implements OnModuleInit {
  private readonly logger = new Logger(BillingService.name);
  private redis: Redis;

  constructor() {
    this.redis = new Redis({ host: '127.0.0.1', port: 6379 });
  }

  async onModuleInit() {
    this.logger.log('🧾 BillingService iniciado. Esperando facturas...');
    await this.consumeInvoices();
  }

  async consumeInvoices() {
    // Creamos (o unimos) un grupo de consumidores
    const stream = 'invoice.stream';
    const group = 'billing-group';
    const consumer = 'worker-1';

    try {
      await this.redis.xgroup('CREATE', stream, group, '$', 'MKSTREAM');
    } catch (err) {
      if (!err.message.includes('BUSYGROUP')) throw err;
    }

    while (true) {
    const result = (await this.redis.xreadgroup(
      'GROUP', group, consumer,
      'COUNT', 1,
      'BLOCK', 5000,
      'STREAMS', stream, '>'
    )) as [string, [string, string[]][]][] | null;

      if (result && Array.isArray(result)) {
        // `result[0][1]` contiene las entradas del stream
        const entries = result[0][1];
        for (const [id, fields] of entries) {
          const dataIndex = fields.indexOf('data');
          const dataStr = dataIndex !== -1 ? fields[dataIndex + 1] : null;

          if (!dataStr) {
            this.logger.warn(`⚠️ Entrada inválida en stream ${id}`);
            continue;
          }

          const invoice = JSON.parse(dataStr);
          this.logger.log(`💰 Procesando factura ${invoice.id} de cliente ${invoice.clientId}`);

          // Simula procesamiento
          await new Promise((r) => setTimeout(r, 500));

          // Confirma (ack)
          await this.redis.xack(stream, group, id);
          this.logger.log(`✅ Factura ${invoice.id} marcada como procesada`);
        }
      }
    }

    
  }
}
