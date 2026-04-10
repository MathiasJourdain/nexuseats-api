import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler'; // N'oublie pas l'import !

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Ta route health check
  @SkipThrottle()
  @Get('health')
  getHealth() {
    return { status: 'up' };
  }

  // ... tes autres routes existantes (s'il y en a)
}