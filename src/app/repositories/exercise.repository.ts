import { Repository, Sequelize } from 'sequelize-typescript';
import ExerciseModel from '../models/exercise.model';
import { Op } from 'sequelize';
import { ExerciseNotFoundException } from '../exceptions/exercise.exception';

export class ExerciseRepository {
  private exerciseModel: Repository<ExerciseModel>;

  constructor(private readonly sequelize: Sequelize) {
    this.exerciseModel = this.sequelize.getRepository(ExerciseModel);
  }

  public async create(options: Pick<ExerciseModel, 'name' | 'difficulty'>): Promise<ExerciseModel> {
    const { name, difficulty } = options;

    return this.exerciseModel
      .create({
        name,
        difficulty,
      })
      .then((exercise) => exercise.get({ plain: true }));
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

  public async findOneAndDelete(options: Pick<ExerciseModel, 'id'>): Promise<void> {
    const { id } = options;

    const exercise = await this.exerciseModel.findByPk(id);
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    await exercise.destroy();
  }
}
