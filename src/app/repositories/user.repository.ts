import { Repository, Sequelize } from 'sequelize-typescript';
import UserModel from '../models/user.model';

export class UserRepository {
  private userModel: Repository<UserModel>;

  constructor(private readonly sequelize: Sequelize) {
    this.userModel = this.sequelize.getRepository(UserModel);
  }

  public async create(
    options: Pick<UserModel, 'name' | 'surname' | 'nickName' | 'email' | 'age' | 'role'>,
  ): Promise<UserModel> {
    const { name, surname, nickName, email, age, role } = options;

    return this.userModel.create({
      name,
      surname,
      nickName,
      email,
      age,
      role,
    });
  }

  public async findOneById(options: Pick<UserModel, 'id'>): Promise<UserModel | null> {
    const { id } = options;

    return this.userModel.findByPk(id, { raw: true });
  }
}
