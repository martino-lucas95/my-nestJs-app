import { ClientProxyFactory, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 8877 },
  });

  const response = await client.send({ cmd: 'get_status' }, {}).toPromise();
  console.log(response);
}
bootstrap();
