import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../types/jwt.user.payload';

interface JwtPayloadFromRequest {
  sub: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload | null => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const rawUser = request.user as JwtPayloadFromRequest;

    if (!rawUser || !rawUser.sub) {
      return null;
    }

    const userPayload: UserPayload = {
      id: rawUser.sub,
      email: rawUser.email,
      role: rawUser.role,
    };

    return userPayload;
  },
);
