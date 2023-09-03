import ExerciseModel from '../models/exercise.model';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { ListExerciseDto } from '../routes/exercise.router';

export class ExerciseService {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

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
}
