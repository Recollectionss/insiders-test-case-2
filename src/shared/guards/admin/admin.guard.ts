import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserJwtDataDto } from '../../../modules/auth/dto/user-jwt-data.dto';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserJwtDataDto;

    if (!user) throw new ForbiddenException('Unauthorized access');

    if (!user.admin) {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}
