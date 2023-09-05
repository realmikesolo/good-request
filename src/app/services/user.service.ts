import { ForbiddenException } from '../../core/http-exceptions';
import { ExerciseNotFoundException } from '../exceptions/exercise.exception';
import { TrackNotFoundException } from '../exceptions/track.exception';
import { UserNotFoundException } from '../exceptions/user.exception';
import TrackModel from '../models/track.model';
import UserModel, { UserRole, UserWithoutPassportModel } from '../models/user.model';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { TrackRepository } from '../repositories/track.repository';
import { UserRepository } from '../repositories/user.repository';
import {
  GetUserDto,
  ListUserDto,
  UserTrackExerciseDto,
  UpdateUserDto,
  UserTrackExerciseListDto,
  UserRemoveTrackExerciseDto,
} from '../routes/user.router';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly trackRepository: TrackRepository,
  ) {}

  public async trackExercise(ctx: UserTrackExerciseDto): Promise<{
    data: TrackModel;
    message: string;
  }> {
    const { body, user, params } = ctx;

    const userProfile = await this.userRepository.findOneById({ id: user.id, raw: true });
    if (!userProfile) {
      throw new UserNotFoundException();
    }

    const exercise = await this.exerciseRepository.findOneById({ id: params.exerciseId });
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    const track = await this.trackRepository.create({
      exerciseId: exercise.id,
      userId: userProfile.id,
      duration: body.duration,
    });

    return {
      data: track,
      message: 'Exercise was tracked',
    };
  }

  public async listTrackExercise(ctx: UserTrackExerciseListDto): Promise<{
    data: TrackModel[];
    message: string;
  }> {
    const { query, user } = ctx;

    const userProfile = await this.userRepository.findOneById({ id: user.id, raw: true });
    if (!userProfile) {
      throw new UserNotFoundException();
    }

    const tracks = await this.trackRepository.list({
      userId: userProfile.id,
      limit: query.limit,
      page: query.page,
    });

    return {
      data: tracks,
      message: 'List of tracked exercises',
    };
  }

  public async get(ctx: GetUserDto): Promise<{
    data: UserWithoutPassportModel;
    message: string;
  }> {
    const { query, user } = ctx;

    if (user.role !== UserRole.ADMIN && query.id) {
      throw new ForbiddenException();
    }

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

  public async removeTrackedExercise(ctx: UserRemoveTrackExerciseDto): Promise<{
    message: string;
  }> {
    const { params, user } = ctx;

    const userProfile = await this.userRepository.findOneById({ id: user.id, raw: true });
    if (!userProfile) {
      throw new UserNotFoundException();
    }

    const track = await this.trackRepository.findOne({
      exerciseId: params.exerciseId,
      userId: userProfile.id,
    });
    if (!track) {
      throw new TrackNotFoundException();
    }

    await this.trackRepository.delete({ track });

    return {
      message: 'Tracked exercise was removed',
    };
  }
}
