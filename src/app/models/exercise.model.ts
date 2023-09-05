import { DataTypes } from 'sequelize';
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import ProgramModel from './program.model';
import { z } from 'zod';
import TrackModel from './track.model';

export enum ExerciseDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

@Table({
  tableName: 'exercises',
  timestamps: true,
})
export default class ExerciseModel extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER(),
    autoIncrement: true,
  })
  public declare id: number;

  @Column({
    type: DataTypes.ENUM(...Object.values(ExerciseDifficulty)),
    allowNull: false,
  })
  public difficulty: ExerciseDifficulty;

  @Column({
    allowNull: false,
    unique: true,
    type: DataTypes.STRING(200),
  })
  public name: string;

  @ForeignKey(() => ProgramModel)
  @Column({
    type: DataTypes.INTEGER(),
  })
  public programId: number | null;

  @BelongsTo(() => ProgramModel)
  public program: ProgramModel;

  @HasMany(() => TrackModel, 'exerciseId')
  public tracks: TrackModel[];
}

export const ExerciseSchema = {
  id: z.number().min(1),
  name: z.string().min(1).max(200),
  difficulty: z.nativeEnum(ExerciseDifficulty),
  programId: z.number().min(1).nullable(),
};
