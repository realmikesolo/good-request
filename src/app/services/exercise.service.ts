import { UniqueConstraintError } from 'sequelize';
import {
  ExerciseNotFoundException,
  ExerciseWithSuchNameAlreadyExistsException,
} from '../exceptions/exercise.exception';
import ExerciseModel from '../models/exercise.model';
import { ExerciseRepository } from '../repositories/exercise.repository';
import {
  AddExerciseToProgramDto,
  CreateExerciseDto,
  DeleteExerciseDto,
  ListExerciseDto,
  RemoveExerciseFromProgramDto,
  UpdateExerciseDto,
} from '../routes/exercise.router';
import { ProgramRepository } from '../repositories/program.repository';
import { ProgramNotFoundException } from '../exceptions/program.exception';

export class ExerciseService {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly programRepository: ProgramRepository,
  ) {}

  public async create(ctx: CreateExerciseDto): Promise<ExerciseModel> {
    const { body } = ctx;

    let exercise: ExerciseModel;
    try {
      exercise = await this.exerciseRepository.create(body);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new ExerciseWithSuchNameAlreadyExistsException();
      }

      throw e;
    }

    return exercise;
  }

  public async addToProgram(ctx: AddExerciseToProgramDto): Promise<ExerciseModel> {
    const { params } = ctx;

    const exercise = await this.exerciseRepository.findOneById({ id: params.id });
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    const program = await this.programRepository.findOneById({ id: params.programId });
    if (!program) {
      throw new ProgramNotFoundException();
    }

    return this.exerciseRepository.update({
      exercise,
      body: {
        programId: program.id,
      },
    });
  }

  public async list(ctx: ListExerciseDto): Promise<ExerciseModel[]> {
    const { query } = ctx;

    return this.exerciseRepository.list(query);
  }

  public async update(ctx: UpdateExerciseDto): Promise<ExerciseModel> {
    const { params, body } = ctx;

    const exercise = await this.exerciseRepository.findOneById(params);
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    let updatedExercise: ExerciseModel;
    try {
      updatedExercise = await this.exerciseRepository.update({
        exercise,
        body,
      });
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new ExerciseWithSuchNameAlreadyExistsException();
      }

      throw e;
    }

    return updatedExercise;
  }

  public async removeFromProgram(ctx: RemoveExerciseFromProgramDto): Promise<ExerciseModel> {
    const { params } = ctx;

    const exercise = await this.exerciseRepository.findOneById({ id: params.id });
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    const program = await this.programRepository.findOneById({ id: params.programId });
    if (!program) {
      throw new ProgramNotFoundException();
    }

    return this.exerciseRepository.update({
      exercise,
      body: {
        programId: null,
      },
    });
  }

  public async delete(ctx: DeleteExerciseDto): Promise<void> {
    const { params } = ctx;

    const exercise = await this.exerciseRepository.findOneById(params);
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    await this.exerciseRepository.delete({ exercise });
  }
}
