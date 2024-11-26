import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.username) {
      throw new ForbiddenException('Access Denied');
    }

    const dbUser = await this.userService.find(user.username);

    if (!dbUser) {
      throw new ForbiddenException('User not found');
    }

    const hasRole = requiredRoles.some((role) => dbUser.role?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}
