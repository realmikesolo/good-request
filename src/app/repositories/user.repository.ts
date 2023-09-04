import { Repository, Sequelize } from 'sequelize-typescript';
import UserModel from '../models/user.model';

export class UserRepository {
  private userModel: Repository<UserModel>;

  constructor(private readonly sequelize: Sequelize) {
    this.userModel = this.sequelize.getRepository(UserModel);
  }

  public async create(options: Pick<UserModel, 'email' | 'password' | 'role'>): Promise<UserModel> {
    const { email, password, role } = options;

    return this.userModel.create(
      {
        email,
        password,
        role,
      },
      { raw: true },
    );
  }

  public async findOneByEmail(options: Pick<UserModel, 'email'>): Promise<UserModel | null> {
    const { email } = options;

    return this.userModel.findOne({ where: { email }, raw: true });
  }

  public async findOneById(options: Pick<UserModel, 'id'>): Promise<UserModel | null> {
    const { id } = options;

    return this.userModel.findByPk(id, { raw: true });
  }
}
