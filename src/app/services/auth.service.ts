import { UniqueConstraintError } from 'sequelize';
import UserModel from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto } from '../routes/auth.router';
import {
  PasswordIsIncorrectException,
  UserNotFoundException,
  UserWithSuchEmailAlreadyExistsException,
} from '../exceptions/user.exception';
import { hash, genSalt, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Env } from '../../core/env';
import { JwtPayload } from '../strategies/jwt.strategy';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(ctx: RegisterDto): Promise<{
    data: Pick<UserModel, 'id' | 'email' | 'role'>;
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
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      message: 'User created',
    };
  }

  public async login(ctx: LoginDto): Promise<{
    data: { token: string };
    message: string;
  }> {
    const { body } = ctx;

    const user = await this.userRepository.findOneByEmail({ email: body.email });
    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new PasswordIsIncorrectException();
    }

    return {
      data: {
        token: this.generateToken({
          id: user.id,
          role: user.role,
        }),
      },
      message: 'User logged in',
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, await genSalt(12));
  }

  private generateToken(user: JwtPayload): string {
    return sign(user, Env.JWT_SECRET, { expiresIn: '1d' });
  }
}
