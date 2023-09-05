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

  public async trackExercise(ctx: UserTrackExerciseDto): Promise<TrackModel> {
    const { body, user, params } = ctx;

    const userProfile = await this.userRepository.findOneById({ id: user.id, raw: true });
    if (!userProfile) {
      throw new UserNotFoundException();
    }

    const exercise = await this.exerciseRepository.findOneById({ id: params.exerciseId });
    if (!exercise) {
      throw new ExerciseNotFoundException();
    }

    return this.trackRepository.create({
      exerciseId: exercise.id,
      userId: userProfile.id,
      duration: body.duration,
    });
  }

  public async listTrackExercise(ctx: UserTrackExerciseListDto): Promise<TrackModel[]> {
    const { query, user } = ctx;

    const userProfile = await this.userRepository.findOneById({ id: user.id, raw: true });
    if (!userProfile) {
      throw new UserNotFoundException();
    }

    return this.trackRepository.list({
      userId: userProfile.id,
      limit: query.limit,
      page: query.page,
    });
  }

  public async get(ctx: GetUserDto): Promise<UserWithoutPassportModel> {
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
      id: userInfo.id,
      name: userInfo.name,
      surname: userInfo.surname,
      nickName: userInfo.nickName,
      age: userInfo.age,
      email: userInfo.email,
      role: userInfo.role,
    };
  }

  public async list(
    ctx: ListUserDto,
  ): Promise<UserWithoutPassportModel[] | Array<Pick<UserModel, 'id' | 'nickName'>>> {
    const { query, user } = ctx;

    const users = await this.userRepository.list(query);

    return user.role === UserRole.ADMIN
      ? users.map(
          (user): UserWithoutPassportModel => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            nickName: user.nickName,
            age: user.age,
            email: user.email,
            role: user.role,
          }),
        )
      : users.map(
          (user): Pick<UserModel, 'id' | 'nickName'> => ({
            id: user.id,
            nickName: user.nickName,
          }),
        );
  }

  public async update(ctx: UpdateUserDto): Promise<UserModel> {
    const { body, query } = ctx;

    const user = await this.userRepository.findOneById({ id: query.id, raw: false });
    if (!user) {
      throw new UserNotFoundException();
    }

    return this.userRepository.update({
      user,
      body,
    });
  }

  public async removeTrackedExercise(ctx: UserRemoveTrackExerciseDto): Promise<void> {
    const { params, user } = ctx;

    const userProfile = await this.userRepository.findOneById({ id: user.id, raw: true });
    if (!userProfile) {
      throw new UserNotFoundException();
    }

    const track = await this.trackRepository.findOneById({ id: params.trackId });
    if (!track) {
      throw new TrackNotFoundException();
    }

    if (track.dataValues.userId !== userProfile.id) {
      throw new ForbiddenException();
    }

    await this.trackRepository.delete({ track });
  }
}
