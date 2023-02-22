import { Request } from 'express';
interface JwtPayload {
    sub: string;
    nickname: string;
    iat: string;
}
export declare class UtilsService {
    getJwtTokenPayloadFromRequest(request: Request): JwtPayload | null;
}
export {};
