import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsServiceController {

  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: any) {
    console.log(`📧 [EMAIL ENVOYÉ] Commande #${data.orderId} confirmée pour ${data.customerEmail}. Total: ${data.total}€`);
  }

  @EventPattern('payment.confirmed')
  handlePaymentConfirmed(@Payload() data: any) {
    console.log(`💰 [EMAIL ENVOYÉ] Paiement #${data.paymentId} reçu avec succès.`);
  }

  @EventPattern('order.delivered')
  handleOrderDelivered(@Payload() data: any) {
    console.log(`📦 [EMAIL ENVOYÉ] Commande #${data.orderId} livrée.`);
  }
}