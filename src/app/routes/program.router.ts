import { Router } from 'express';
import { z } from 'zod';
import { LimitValidator, PageValidator, SearchValidator } from '../../core/validators';
import { sequelize } from '../../core/db/db';
import { ProgramService } from '../services/program.service';
import { ProgramRepository } from '../repositories/program.repository';
import { HttpStatus } from '../../core/http-status';

const programService = new ProgramService(new ProgramRepository(sequelize));

export async function programRouter(router: Router): Promise<void> {
  router.get('/program/list', async (req, res, next) => {
    try {
      const { query } = await ListProgramSchema.parseAsync({ query: req.query });
      const { data, message } = await programService.list({ query });

      res.json({ data, message }).status(HttpStatus.OK);
    } catch (e) {
      next(e);
    }
  });
}

const ListProgramSchema = z
  .object({
    query: z
      .object({
        limit: LimitValidator(1, 100, 10),
        page: PageValidator(),
        search: SearchValidator(),
      })
      .strict(),
  })
  .strict();

export type ListProgramDto = z.infer<typeof ListProgramSchema>;
