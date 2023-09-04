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

  public async create(ctx: CreateExerciseDto): Promise<{
    data: ExerciseModel;
    message: string;
  }> {
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

    return {
      data: exercise,
      message: 'Exercise created',
    };
  }

  public async addToProgram(ctx: AddExerciseToProgramDto): Promise<{
    data: ExerciseModel;
    message: string;
  }> {
    const { params } = ctx;

    const exercise = await this.exerciseRepository.findOneById({ id: params.id });
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    const program = await this.programRepository.findOneById({ id: params.programId });
    if (!program) {
      throw new ProgramNotFoundException();
    }

    const updatedExercise = await this.exerciseRepository.update({
      exercise,
      body: {
        programId: program.id,
      },
    });

    return {
      data: updatedExercise,
      message: 'Exercise was added to program',
    };
  }

  public async list(ctx: ListExerciseDto): Promise<{
    data: ExerciseModel[];
    message: string;
  }> {
    const { query } = ctx;

    const exercises = await this.exerciseRepository.list(query);

    return {
      data: exercises,
      message: 'List of exercises',
    };
  }

  public async update(ctx: UpdateExerciseDto): Promise<{
    data: ExerciseModel;
    message: string;
  }> {
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

    return {
      data: updatedExercise,
      message: 'Exercise was updated',
    };
  }

  public async removeFromProgram(ctx: RemoveExerciseFromProgramDto): Promise<{
    data: ExerciseModel;
    message: string;
  }> {
    const { params } = ctx;

    const exercise = await this.exerciseRepository.findOneById({ id: params.id });
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    const program = await this.programRepository.findOneById({ id: params.programId });
    if (!program) {
      throw new ProgramNotFoundException();
    }

    const updatedExercise = await this.exerciseRepository.update({
      exercise,
      body: {
        programId: null,
      },
    });

    return {
      data: updatedExercise,
      message: 'Exercise was removed from program',
    };
  }

  public async delete(ctx: DeleteExerciseDto): Promise<{
    message: string;
  }> {
    const { params } = ctx;

    const exercise = await this.exerciseRepository.findOneById(params);
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    await this.exerciseRepository.delete({ exercise });

    return {
      message: 'Exercise was deleted',
    };
  }
}
