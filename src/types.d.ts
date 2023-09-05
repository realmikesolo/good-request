import { JwtPayload } from './app/strategies/jwt.strategy';

declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}
export {};
