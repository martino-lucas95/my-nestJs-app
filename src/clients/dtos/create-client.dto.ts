import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @IsNotEmpty()
  @ApiProperty({ example: 12345678 })
  idNumber: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsOptional()
  @ApiProperty({ example: '+59897123456' })
  phone?: string;
}
