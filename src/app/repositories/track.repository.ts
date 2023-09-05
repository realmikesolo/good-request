import { Repository, Sequelize } from 'sequelize-typescript';
import TrackModel from '../models/track.model';

export class TrackRepository {
  private trackModel: Repository<TrackModel>;

  constructor(private readonly sequelize: Sequelize) {
    this.trackModel = this.sequelize.getRepository(TrackModel);
  }

  public async create(options: Pick<TrackModel, 'exerciseId' | 'userId' | 'duration'>): Promise<TrackModel> {
    const { exerciseId, userId, duration } = options;

    return this.trackModel
      .create({
        exerciseId,
        userId,
        dateCompletion: new Date(),
        duration,
      })
      .then((track) => track.get({ plain: true }));
  }

  public async findOneById(options: Pick<TrackModel, 'id'>): Promise<TrackModel | null> {
    const { id } = options;

    return this.trackModel.findByPk(id);
  }

  public async list(options: { userId: number; limit: number; page: number }): Promise<TrackModel[]> {
    const { userId, limit, page } = options;
    const offset = limit * page;

    return this.trackModel.findAll({
      where: {
        userId,
      },
      limit,
      offset,
      raw: true,
    });
  }

  public async delete(options: { track: TrackModel }): Promise<void> {
    const { track } = options;

    return track.destroy();
  }
}
