import { UserNotFoundException } from '../exceptions/user.exception';
import UserModel, { UserRole, UserWithoutPassportModel } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { GetUserDto, ListUserDto, UpdateUserDto } from '../routes/user.router';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async get(ctx: GetUserDto): Promise<{
    data: UserWithoutPassportModel;
    message: string;
  }> {
    const { query, user } = ctx;

    const userId = query.id ?? user.id;

    const userInfo = await this.userRepository.findOneById({ id: userId, raw: true });
    if (!userInfo) {
      throw new UserNotFoundException();
    }

    return {
      data: {
        id: userInfo.id,
        name: userInfo.name,
        surname: userInfo.surname,
        nickName: userInfo.nickName,
        age: userInfo.age,
        email: userInfo.email,
        role: userInfo.role,
      },
      message: 'User info',
    };
  }

  public async list(ctx: ListUserDto): Promise<{
    data: UserWithoutPassportModel | Array<Pick<UserModel, 'id' | 'nickName'>>;
    message: string;
  }> {
    const { query, user } = ctx;

    const users = await this.userRepository.list(query);

    return {
      data:
        user.role === UserRole.ADMIN
          ? users.map((user) => ({
              id: user.id,
              name: user.name,
              surname: user.surname,
              nickName: user.nickName,
              age: user.age,
              email: user.email,
              role: user.role,
            }))
          : users.map((user) => ({
              id: user.id,
              nickName: user.nickName,
            })),
      message: 'List of users',
    };
  }

  public async update(ctx: UpdateUserDto): Promise<{
    data: UserModel;
    message: string;
  }> {
    const { body, query } = ctx;

    const user = await this.userRepository.findOneById({ id: query.id, raw: false });
    if (!user) {
      throw new UserNotFoundException();
    }

    const updatedUser = await this.userRepository.update({
      user,
      body,
    });

    return {
      data: updatedUser,
      message: 'User was updated',
    };
  }
}
