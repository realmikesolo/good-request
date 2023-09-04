import { Router } from 'express';
import { z } from 'zod';
import { sequelize } from '../../core/db/db';
import { HttpStatus } from '../../core/http-status';
import {
  IdValidator,
  LimitValidator,
  PageValidator,
  ProgramIdFilterValidator,
  SearchValidator,
} from '../../core/validators';
import { ExerciseSchema } from '../models/exercise.model';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { ExerciseService } from '../services/exercise.service';
import { authJwt } from '../strategies/jwt.strategy';
import { isAdminMiddleware } from '../middlewares/is-admin.middleware';
import { ProgramRepository } from '../repositories/program.repository';

const exerciseService = new ExerciseService(
  new ExerciseRepository(sequelize),
  new ProgramRepository(sequelize),
);

export async function exerciseRouter(router: Router): Promise<void> {
  router.post('/exercise', authJwt, isAdminMiddleware, async (req, res, next) => {
    try {
      const { body } = await CreateExerciseSchema.parseAsync({ body: req.body });
      const { data, message } = await exerciseService.create({ body });

      res.json({ data, message }).status(HttpStatus.CREATED);
    } catch (e) {
      next(e);
    }
  });

  router.post('/exercise/:id/program/:programId', authJwt, isAdminMiddleware, async (req, res, next) => {
    try {
      const { params } = await AddExerciseToProgramSchema.parseAsync({ params: req.params });
      const { data, message } = await exerciseService.addToProgram({ params });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.get('/exercise/list', async (req, res, next) => {
    try {
      const { query } = await ListExerciseSchema.parseAsync({ query: req.query });
      const { data, message } = await exerciseService.list({ query });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.patch('/exercise/:id', authJwt, isAdminMiddleware, async (req, res, next) => {
    try {
      const { params, body } = await UpdateExerciseSchema.parseAsync({ params: req.params, body: req.body });
      const { data, message } = await exerciseService.update({ params, body });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.delete('/exercise/:id/program/:programId', authJwt, isAdminMiddleware, async (req, res, next) => {
    try {
      const { params } = await RemoveExerciseFromProgramSchema.parseAsync({ params: req.params });
      const { data, message } = await exerciseService.removeFromProgram({ params });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });

  router.delete('/exercise/:id', authJwt, isAdminMiddleware, async (req, res, next) => {
    try {
      const { params } = await DeleteExerciseSchema.parseAsync({ params: req.params });
      const { message } = await exerciseService.delete({ params });

      res.json({ message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });
}

const CreateExerciseSchema = z
  .object({
    body: z
      .object({
        name: ExerciseSchema.name,
        difficulty: ExerciseSchema.difficulty,
      })
      .strict(),
  })
  .strict();

export type CreateExerciseDto = z.infer<typeof CreateExerciseSchema>;

const AddExerciseToProgramSchema = z
  .object({
    params: z
      .object({
        id: IdValidator(),
        programId: IdValidator(),
      })
      .strict(),
  })
  .strict();

export type AddExerciseToProgramDto = z.infer<typeof AddExerciseToProgramSchema>;

const ListExerciseSchema = z
  .object({
    query: z
      .object({
        limit: LimitValidator(1, 100, 10),
        page: PageValidator(),
        programId: ProgramIdFilterValidator(),
        search: SearchValidator(),
      })
      .strict(),
  })
  .strict();

export type ListExerciseDto = z.infer<typeof ListExerciseSchema>;

const UpdateExerciseSchema = z
  .object({
    body: z
      .object({
        name: ExerciseSchema.name.optional(),
        difficulty: ExerciseSchema.difficulty.optional(),
        programId: ProgramIdFilterValidator().optional(),
      })
      .strict(),
    params: z
      .object({
        id: IdValidator(),
      })
      .strict(),
  })
  .strict();

export type UpdateExerciseDto = z.infer<typeof UpdateExerciseSchema>;

const RemoveExerciseFromProgramSchema = z.object({
  params: z.object({
    id: IdValidator(),
    programId: IdValidator(),
  }),
});

export type RemoveExerciseFromProgramDto = z.infer<typeof RemoveExerciseFromProgramSchema>;

const DeleteExerciseSchema = z
  .object({
    params: z
      .object({
        id: IdValidator(),
      })
      .strict(),
  })
  .strict();

export type DeleteExerciseDto = z.infer<typeof DeleteExerciseSchema>;
