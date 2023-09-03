import { Router } from 'express';
import { z } from 'zod';
import { ExerciseService } from '../services/exercise.service';
import { LimitValidator, PageValidator, ProgramIdValidator, SearchValidator } from '../../core/validators';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { sequelize } from '../../core/db/db';
import { HttpStatus } from '../../core/http-status';

const exerciseService = new ExerciseService(new ExerciseRepository(sequelize));

export async function exerciseRouter(router: Router): Promise<void> {
  router.get('/exercise/list', async (req, res, next) => {
    try {
      const { query } = await ListExerciseSchema.parseAsync({ query: req.query });
      const { data, message } = await exerciseService.list({ query });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });
}

const ListExerciseSchema = z
  .object({
    query: z
      .object({
        limit: LimitValidator(1, 100, 10),
        page: PageValidator(),
        programId: ProgramIdValidator(),
        search: SearchValidator(),
      })
      .strict(),
  })
  .strict();

export type ListExerciseDto = z.infer<typeof ListExerciseSchema>;
