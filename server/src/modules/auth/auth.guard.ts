import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { UserCredentials } from 'src/models';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authData = ctx.req.headers?.authorization ?? ctx.req?.Authorization;

    if (!authData) {
      return false;
    }
    ctx.user = await this.validateToken(authData);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('TOKEN_REQUIRED', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as UserCredentials;

      if (!decoded.username) {
        throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
      }

      return decoded;
    } catch (err) {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }
  }
}
