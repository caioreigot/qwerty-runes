import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import jwt_decode from 'jwt-decode';

interface JwtPayload {
  sub: string;
  nickname: string;
  iat: string;
}

@Injectable()
export class UtilsService {
  getJwtTokenPayloadFromRequest(request: Request): JwtPayload {
    const token = request.headers.authorization.split(' ')[1];
    return jwt_decode(token);
  }
}
