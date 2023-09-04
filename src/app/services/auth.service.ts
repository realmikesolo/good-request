import { UniqueConstraintError } from 'sequelize';
import UserModel from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../routes/auth.router';
import { UserWithSuchEmailAlreadyExistsException } from '../exceptions/user.exception';
import { hash, genSalt } from 'bcrypt';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(ctx: RegisterDto): Promise<{
    data: UserModel;
    message: string;
  }> {
    const { body } = ctx;

    let user: UserModel;

    try {
      user = await this.userRepository.create({ ...body, password: await this.hashPassword(body.password) });
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new UserWithSuchEmailAlreadyExistsException();
      }

      throw e;
    }

    return {
      data: user,
      message: 'User created',
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, await genSalt(10));
  }
}
