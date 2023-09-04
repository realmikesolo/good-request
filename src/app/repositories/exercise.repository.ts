import { Op } from 'sequelize';
import { Repository, Sequelize } from 'sequelize-typescript';
import ExerciseModel from '../models/exercise.model';

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

  public async findOneById(options: Pick<ExerciseModel, 'id'>): Promise<ExerciseModel | null> {
    const { id } = options;

    return this.exerciseModel.findByPk(id);
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

  public async update(options: {
    exercise: ExerciseModel;
    body: Partial<Pick<ExerciseModel, 'name' | 'difficulty'>>;
  }): Promise<ExerciseModel> {
    const { exercise, body } = options;

    return exercise.update(body);
  }

  public async delete(options: { exercise: ExerciseModel }): Promise<void> {
    const { exercise } = options;

    return exercise.destroy();
  }
}
