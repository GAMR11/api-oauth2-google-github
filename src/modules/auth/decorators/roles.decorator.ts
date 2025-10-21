import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Decorator para especificar roles permitidos
 * 
 * Uso:
 * @Roles(UserRole.ADMIN)
 * @Delete(':id')
 * deleteUser(@Param('id') id: string) {
 *   // Solo admins pueden acceder
 * }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);