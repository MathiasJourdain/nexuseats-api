import { Controller, Get, Post, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto'; // Vérifie bien le chemin ici

@ApiTags('orders') // Regroupe les routes dans la section "orders" de Swagger
@ApiBearerAuth()   // Affiche le cadenas (nécessite un token JWT pour tester)
@Controller('orders')
export class GatewayOrdersController {
  
  constructor(@Inject('ORDERS_SERVICE') private client: ClientProxy) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer une commande', 
    description: 'Envoie une nouvelle commande au microservice de gestion via RabbitMQ.' 
  })
  @ApiResponse({ status: 201, description: 'La commande a été transmise avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides. Vérifiez le format du JSON envoyé.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non connecté (Token manquant ou expiré).' })
  @ApiResponse({ status: 503, description: 'Le microservice Orders est injoignable.' })
  createOrder(@Body() dto: CreateOrderDto): Observable<any> {
    console.log('🚀 [Gateway] Envoi de create_order à RabbitMQ...');
    return this.client.send({ cmd: 'create_order' }, dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer toutes les commandes', 
    description: 'Liste l\'ensemble des commandes présentes dans le système.' 
  })
  @ApiResponse({ status: 200, description: 'Liste récupérée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé. Rôle administrateur requis.' })
  getOrders(): Observable<any> {
    console.log('🚀 [Gateway] Envoi de get_orders à RabbitMQ...');
    return this.client.send({ cmd: 'get_orders' }, {});
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer une commande par ID', 
    description: 'Recherche une commande spécifique via son identifiant unique.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Identifiant unique de la commande', 
    example: '1773996054617' 
  })
  @ApiResponse({ status: 200, description: 'Commande trouvée.' })
  @ApiResponse({ status: 404, description: 'Aucune commande trouvée avec cet identifiant.' })
  getOrderById(@Param('id') id: string): Observable<any> {
    console.log(`🚀 [Gateway] Envoi de get_order_by_id à RabbitMQ (ID: ${id})...`);
    return this.client.send({ cmd: 'get_order_by_id' }, id);
  }
}