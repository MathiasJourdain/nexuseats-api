import { Controller, Post, Body, Get, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('orders')
export class OrdersServiceController {
  private orders: any[] = [];

  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly notificationsClient: ClientProxy,
    // 🚀 On injecte le nouveau client Analytics ici :
    @Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() data: any) {
    const newOrder = { id: Date.now(), ...data, status: 'CREATED' };
    this.orders.push(newOrder);

    const payload = {
      orderId: newOrder.id,
      customerEmail: newOrder.customerEmail || 'client@fantome.com',
      total: newOrder.total || 42.50,
      timestamp: new Date(),
    };

    console.log(`📤 [OrdersService] Émission de l'événement aux 2 services pour la commande #${newOrder.id}`);
    
    // 🚀 On envoie le message aux DEUX queues !
    this.notificationsClient.emit('order.created', payload);
    this.analyticsClient.emit('order.created', payload);
    
    return newOrder;
  }

  // ... (Garde tes méthodes @Get() en dessous)
}