import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AnalyticsServiceController {

  // Il écoute EXACTEMENT le même événement que le Notifications Service
  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: any) {
    console.log(`📈 [ANALYTICS] Nouvelle vente enregistrée ! Montant : ${data.total}€ (Commande #${data.orderId})`);
  }
}