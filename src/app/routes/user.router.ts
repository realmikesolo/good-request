import { Router } from 'express';
import { z } from 'zod';
import { IdValidator, LimitValidator, PageValidator } from '../../core/validators';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { sequelize } from '../../core/db/db';
import { HttpStatus } from '../../core/http-status';
import { authJwt } from '../strategies/jwt.strategy';
import { UserSchema } from '../models/user.model';

const userService = new UserService(new UserRepository(sequelize));

export async function userRouter(router: Router): Promise<void> {
  router.get('/user', authJwt, async (req, res, next) => {
    try {
      const { query, user } = await GetUserSchema.parseAsync({ query: req.query, user: req.user });
      const { data, message } = await userService.get({ query, user });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.get('/user/list', authJwt, async (req, res, next) => {
    try {
      const { query, user } = await ListUserSchema.parseAsync({ query: req.query, user: req.user });
      const { data, message } = await userService.list({ query, user });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });
}

const GetUserSchema = z
  .object({
    query: z
      .object({
        id: IdValidator().optional(),
      })
      .strict(),
    user: z.object({
      id: z.number().int().positive().min(1),
    }),
  })
  .strict();

export type GetUserDto = z.infer<typeof GetUserSchema>;

const ListUserSchema = z
  .object({
    query: z
      .object({
        limit: LimitValidator(1, 100, 10),
        page: PageValidator(),
      })
      .strict(),
    user: z.object({
      role: UserSchema.role,
    }),
  })
  .strict();

export type ListUserDto = z.infer<typeof ListUserSchema>;
