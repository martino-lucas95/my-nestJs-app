import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Simula validación de usuario (en producción usar DB)
  validateUser(username: string, password: string): boolean {
    return username === process.env.SWAGGER_USER && password === process.env.SWAGGER_PASSWORD;
  }

  login(username: string, password: string) {
    if (!this.validateUser(username, password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verify(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
