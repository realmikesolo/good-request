import { UniqueConstraintError } from 'sequelize';
import { ExerciseWithSuchNameAlreadyExistsException } from '../exceptions/exercise.exception';
import ExerciseModel from '../models/exercise.model';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { CreateExerciseDto, DeleteExerciseDto, ListExerciseDto } from '../routes/exercise.router';

export class ExerciseService {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

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

  public async delete(ctx: DeleteExerciseDto): Promise<{
    message: string;
  }> {
    const { params } = ctx;

    await this.exerciseRepository.findOneAndDelete(params);

    return {
      message: 'Exercise was deleted',
    };
  }
}
