import UserModel, { UserRole } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { ListUserDto } from '../routes/user.router';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async list(ctx: ListUserDto): Promise<{
    data:
      | Pick<UserModel, 'id' | 'name' | 'surname' | 'nickName' | 'age' | 'email' | 'role'>
      | Array<Pick<UserModel, 'id' | 'nickName'>>;
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
}
