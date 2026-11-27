import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt , Strategy } from 'passport-jwt';

export const JWT_SECRET = 'THIS_IS_SECRET';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        });
    }

    // Whatever this returns gets attached to the 'request.user'
    async validate(payload : {sub: number; email: string; role: string}) {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role
        }
    }
}