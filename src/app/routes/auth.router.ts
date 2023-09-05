import { Router } from 'express';
import { z } from 'zod';
import { sequelize } from '../../core/db/db';
import { HttpStatus } from '../../core/http-status';
import { UserSchema } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';

const authService = new AuthService(new UserRepository(sequelize));

export async function authRouter(router: Router): Promise<void> {
  router.post('/auth/register', async (req, res, next) => {
    try {
      const { body } = await RegisterSchema.parseAsync({ body: req.body });
      const { data, message } = await authService.register({ body });

      res.json({ data, message }).status(HttpStatus.CREATED);
    } catch (e) {
      next(e);
    }
  });

  router.post('/auth/login', async (req, res, next) => {
    try {
      const { body } = await LoginSchema.parseAsync({ body: req.body });
      const { data, message } = await authService.login({ body });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });
}

const RegisterSchema = z
  .object({
    body: z
      .object({
        email: UserSchema.email,
        password: UserSchema.password,
        role: UserSchema.role,
      })
      .strict(),
  })
  .strict();

export type RegisterDto = z.infer<typeof RegisterSchema>;

const LoginSchema = z
  .object({
    body: z
      .object({
        email: UserSchema.email,
        password: UserSchema.password,
      })
      .strict(),
  })
  .strict();

export type LoginDto = z.infer<typeof LoginSchema>;
