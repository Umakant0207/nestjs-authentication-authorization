import { Injectable , CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles, ROLES_KEY } from '../decorators/roles.decorator.js';
import { Role } from '../../users/user.entity.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 1. Read the roles required by the @Roles decorator on the route
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If no @Roles() decorator is present, allow access
        if (!requiredRoles) {
            return true;
        }

        // 2. Grab the user attached by JwtAuthGuard
        const { user } = context.switchToHttp().getRequest();

        // 3. Check if the user's role matches any allowed role
        return requiredRoles.includes(user?.role);
    }
}