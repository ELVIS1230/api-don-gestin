import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CardsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers['authorization']) {
      throw new UnauthorizedException({
        info: { typeCode: 'NotToken' },
        message: 'No se ha proporcionado el token',
      });
    }
    return true;
  }
}
