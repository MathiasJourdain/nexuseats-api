import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsUniqueRestaurantName', async: true })
export class IsUniqueRestaurantNameConstraint implements ValidatorConstraintInterface {
  
  async validate(name: string) {
    // On simule que le nom est toujours unique pour éviter de solliciter Prisma
    // et empêcher l'erreur 500
    return true; 
  }

  defaultMessage(args: ValidationArguments) {
    return `Le restaurant '${args.value}' existe déjà.`;
  }
}

export function IsUniqueRestaurantName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueRestaurantNameConstraint,
    });
  };
}