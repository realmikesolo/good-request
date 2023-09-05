import { Router } from 'express';
import { z } from 'zod';
import { NumericStringValidator, LimitValidator, PageValidator } from '../../core/validators';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { sequelize } from '../../core/db/db';
import { HttpStatus } from '../../core/http-status';
import { JwtPayload, authJwt } from '../strategies/jwt.strategy';
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
  router.post('/user/track-exercise/:exerciseId', authJwt, async (req, res, next) => {
    try {
      const { params, body } = await UserTrackExerciseSchema.parseAsync({
        params: req.params,
        body: req.body,
      });
      const { data, message } = await userService.trackExercise({ params, body, user: req.user! });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.get('/user/track-exercise/list', authJwt, async (req, res, next) => {
    try {
      const { query } = await UserTrackExerciseListSchema.parseAsync({ query: req.query });
      const { data, message } = await userService.listTrackExercise({ query, user: req.user! });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.get('/user', authJwt, async (req, res, next) => {
    try {
      const { query } = await GetUserSchema.parseAsync({ query: req.query });
      const { data, message } = await userService.get({ query, user: req.user! });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.get('/user/list', authJwt, async (req, res, next) => {
    try {
      const { query } = await ListUserSchema.parseAsync({ query: req.query });
      const { data, message } = await userService.list({ query, user: req.user! });

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

  router.delete('/user/track-exercise/:trackId', authJwt, async (req, res, next) => {
    try {
      const { params } = await UserRemoveTrackExerciseSchema.parseAsync({ params: req.params });
      const { message } = await userService.removeTrackedExercise({ params, user: req.user! });

      res.json({ message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });
}

const UserTrackExerciseSchema = z
  .object({
    params: z
      .object({
        exerciseId: NumericStringValidator(),
      })
      .strict(),
    body: z
      .object({
        duration: z.number().int().positive().min(1),
      })
      .strict(),
  })
  .strict();

export type UserTrackExerciseDto = z.infer<typeof UserTrackExerciseSchema> & { user: JwtPayload };

const UserTrackExerciseListSchema = z
  .object({
    query: z
      .object({
        limit: LimitValidator(1, 100, 10),
        page: PageValidator(),
      })
      .strict(),
  })
  .strict();

export type UserTrackExerciseListDto = z.infer<typeof UserTrackExerciseListSchema> & { user: JwtPayload };

const GetUserSchema = z
  .object({
    query: z
      .object({
        id: NumericStringValidator().optional(),
      })
      .strict(),
  })
  .strict();

export type GetUserDto = z.infer<typeof GetUserSchema> & { user: JwtPayload };

const ListUserSchema = z
  .object({
    query: z
      .object({
        limit: LimitValidator(1, 100, 10),
        page: PageValidator(),
      })
      .strict(),
  })
  .strict();

export type ListUserDto = z.infer<typeof ListUserSchema> & { user: JwtPayload };

const UpdateUserSchema = z
  .object({
    body: z
      .object({
        name: UserSchema.name.optional(),
        surname: UserSchema.surname.optional(),
        nickName: UserSchema.nickName.optional(),
        age: UserSchema.age.optional(),
        role: UserSchema.role.optional(),
      })
      .strict(),
    query: z
      .object({
        id: NumericStringValidator(),
      })
      .strict(),
  })
  .strict();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

const UserRemoveTrackExerciseSchema = z
  .object({
    params: z
      .object({
        trackId: NumericStringValidator(),
      })
      .strict(),
  })
  .strict();

export type UserRemoveTrackExerciseDto = z.infer<typeof UserRemoveTrackExerciseSchema> & { user: JwtPayload };
