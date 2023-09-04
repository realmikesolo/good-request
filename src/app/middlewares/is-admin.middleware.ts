import { Request, NextFunction, Response } from 'express';
import { ForbiddenException } from '../../core/http-exceptions';
import { UserNotFoundException } from '../exceptions/user.exception';
import { UserRole } from '../models/user.model';
import { AuthRequest } from '../strategies/jwt.strategy';

export function isAdminMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const { user } = req as unknown as AuthRequest;

    if (!user) {
      throw new UserNotFoundException();
    }
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
    }

    next();
  } catch (e) {
    next(e);
  }
}
