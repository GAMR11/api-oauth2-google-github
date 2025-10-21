import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Guard para verificar roles de usuario
 * Debe usarse junto con JwtAuthGuard
 * 
 * Ejemplo:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles(UserRole.ADMIN)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener roles requeridos del decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles especificados, permitir acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtener usuario de la request
    const { user } = context.switchToHttp().getRequest();

    // Verificar si el usuario tiene alguno de los roles requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}