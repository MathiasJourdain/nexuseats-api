import { Controller, Post, Body, VERSION_NEUTRAL } from '@nestjs/common'; // 👈 Import de VERSION_NEUTRAL
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: VERSION_NEUTRAL // 👈 Étape 4 : Pas de préfixe de version (ex: /auth/login)
})
export class AuthController {
  
  @Throttle({ short: { limit: 3, ttl: 1000 } }) 
  @Post('login')
  @ApiOperation({ 
    summary: 'Connexion utilisateur', 
    description: 'Permet d\'obtenir un token JWT. Cet endpoint est VERSION_NEUTRAL (accessible sans /v1/ ou /v2/).' 
  })
  @ApiBody({ 
    schema: { 
      example: { email: 'test@nexuseats.fr', password: 'password123' } 
    } 
  })
  @ApiResponse({ status: 201, description: 'Authentification réussie, token généré.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  @ApiResponse({ status: 429, description: 'Trop de tentatives (Rate Limit). Attendez 10s.' })
  login(@Body() body: any) {
    // Dans un vrai projet, on appellerait le AuthService ici
    return { message: 'Login attempt successful', accessToken: 'fake-jwt-token-12345' };
  }
}