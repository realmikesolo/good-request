import { Repository, Sequelize } from 'sequelize-typescript';
import UserModel from '../models/user.model';

export class UserRepository {
  private userModel: Repository<UserModel>;

  constructor(private readonly sequelize: Sequelize) {
    this.userModel = this.sequelize.getRepository(UserModel);
  }

  public async create(options: Pick<UserModel, 'email' | 'password' | 'role'>): Promise<UserModel> {
    const { email, password, role } = options;

    return this.userModel
      .create({
        email,
        password,
        role,
      })
      .then((user) => user.get({ plain: true }));
  }

  public async findOneByEmail(options: Pick<UserModel, 'email'>): Promise<UserModel | null> {
    const { email } = options;

    return this.userModel.findOne({ where: { email }, raw: true });
  }

  public async findOneById(options: Pick<UserModel, 'id'> & { raw: boolean }): Promise<UserModel | null> {
    const { id, raw } = options;

    return this.userModel.findByPk(id, { raw });
  }

  public async list(options: { limit: number; page: number }): Promise<UserModel[]> {
    const { limit, page } = options;
    const offset = limit * page;

    return this.userModel.findAll({
      limit,
      offset,
      raw: true,
    });
  }

  public async update(options: {
    user: UserModel;
    body: Partial<Pick<UserModel, 'name' | 'surname' | 'nickName' | 'age' | 'role'>>;
  }): Promise<UserModel> {
    const { user, body } = options;

    return user.update(body);
  }
}
