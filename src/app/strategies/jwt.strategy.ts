import passport, { PassportStatic } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from '../../core/env';
import { UnauthorizedException } from '../../core/http-exceptions';
import UserModel from '../models/user.model';

export function initPassport(passport: PassportStatic): void {
  passport.use(
    new Strategy(
      {
        secretOrKey: Env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      (payload: JwtPayload, done) => {
        if (!payload) {
          const exception = new UnauthorizedException();
          return done(exception, false);
        }

        done(null, payload);
      },
    ),
  );
}

export const authJwt = passport.authenticate('jwt', { session: false });

export type JwtPayload = Pick<UserModel, 'id' | 'role'>;
