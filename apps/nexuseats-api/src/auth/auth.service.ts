import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Cet email est déjà utilisé');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    return this.generateToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Identifiants incorrects');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Identifiants incorrects');

    return this.generateToken(user.id, user.email, user.role);
  }

  private generateToken(id: number, email: string, role: string) {
    const payload = { sub: id, email, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}