import { Repository, Sequelize } from 'sequelize-typescript';
import ExerciseModel from '../models/exercise.model';
import { Op } from 'sequelize';

export class ExerciseRepository {
  private exerciseModel: Repository<ExerciseModel>;

  constructor(private readonly sequelize: Sequelize) {
    this.exerciseModel = this.sequelize.getRepository(ExerciseModel);
  }

  public async list(options: {
    limit: number;
    page: number;
    programId?: number;
    search?: string;
  }): Promise<ExerciseModel[]> {
    const { limit, page, programId, search } = options;
    const offset = limit * page;

    return this.exerciseModel.findAll({
      where: {
        ...(programId && { programId }),
        ...(search && {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        }),
      },

      limit,
      offset,
      raw: true,
    });
  }
}
