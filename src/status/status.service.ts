import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class StatusService {
  @MessagePattern({ cmd: 'get_status' })
  getStatus() {
    return {
      status: 'ok',
      message: 'Sistema operativo saludable',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern({ cmd: 'get_uptime' })
  getUptime() {
    const uptimeInSeconds = process.uptime();
    return {
      message: `El sistema ha estado en funcionamiento durante ${Math.floor(
        uptimeInSeconds / 60,
      )} minutos.`,
    };
  }
}
