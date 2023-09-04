import { Repository, Sequelize } from 'sequelize-typescript';
import ProgramModel from '../models/program.model';
import { Op } from 'sequelize';

export class ProgramRepository {
  private programModel: Repository<ProgramModel>;

  constructor(private readonly sequelize: Sequelize) {
    this.programModel = this.sequelize.getRepository(ProgramModel);
  }

  public async findOneById(options: Pick<ProgramModel, 'id'>): Promise<ProgramModel | null> {
    const { id } = options;

    return this.programModel.findByPk(id);
  }

  public async list(options: { limit: number; page: number; search?: string }): Promise<ProgramModel[]> {
    const { limit, page, search } = options;
    const offset = limit * page;

    return this.programModel.findAll({
      where: {
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
