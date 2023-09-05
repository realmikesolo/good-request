import { Router } from 'express';
import { z } from 'zod';
import { IdValidator, LimitValidator, PageValidator } from '../../core/validators';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { sequelize } from '../../core/db/db';
import { HttpStatus } from '../../core/http-status';
import { authJwt } from '../strategies/jwt.strategy';
import { UserSchema } from '../models/user.model';
import { isAdminMiddleware } from '../middlewares/is-admin.middleware';
import { TrackRepository } from '../repositories/track.repository';
import { ExerciseRepository } from '../repositories/exercise.repository';

const userService = new UserService(
  new UserRepository(sequelize),
  new ExerciseRepository(sequelize),
  new TrackRepository(sequelize),
);

export async function userRouter(router: Router): Promise<void> {
  router.post('/user/track-exercise/:id', authJwt, async (req, res, next) => {
    try {
      const { params, user, body } = await TrackUserExerciseSchema.parseAsync({
        params: req.params,
        user: req.user,
        body: req.body,
      });
      const { data, message } = await userService.trackExercise({ params, user, body });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.get('/user/track-exercise/list', authJwt, async (req, res, next) => {
    try {
      const { query, user } = await UserTrackExerciseListSchema.parseAsync({
        query: req.query,
        user: req.user,
      });
      const { data, message } = await userService.listTrackExercise({ query, user });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

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

  router.patch('/user', authJwt, isAdminMiddleware, async (req, res, next) => {
    try {
      const { body, query } = await UpdateUserSchema.parseAsync({ body: req.body, query: req.query });
      const { data, message } = await userService.update({ body, query });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });
}

const TrackUserExerciseSchema = z.object({
  params: z.object({
    id: IdValidator(),
  }),
  user: z.object({
    id: z.number().int().positive().min(1),
  }),
  body: z.object({
    duration: z.number().int().positive().min(1),
  }),
});

export type TrackUserExerciseDto = z.infer<typeof TrackUserExerciseSchema>;

const UserTrackExerciseListSchema = z.object({
  query: z.object({
    limit: LimitValidator(1, 100, 10),
    page: PageValidator(),
  }),
  user: z.object({
    id: z.number().int().positive().min(1),
  }),
});

export type UserTrackExerciseListDto = z.infer<typeof UserTrackExerciseListSchema>;

const GetUserSchema = z
  .object({
    query: z
      .object({
        id: IdValidator().optional(),
      })
      .strict(),
    user: z.object({
      id: z.number().int().positive().min(1),
      role: UserSchema.role,
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

const UpdateUserSchema = z.object({
  body: z.object({
    name: UserSchema.name.optional(),
    surname: UserSchema.surname.optional(),
    nickName: UserSchema.nickName.optional(),
    age: UserSchema.age.optional(),
    role: UserSchema.role.optional(),
  }),
  query: z.object({
    id: IdValidator(),
  }),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
