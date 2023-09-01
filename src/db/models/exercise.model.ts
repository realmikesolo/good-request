import { DataTypes } from 'sequelize';
import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import ProgramModel from './program.model';
import { ExerciseDifficulty } from '../../shared/enums/exercise-difficulty.enum';

@Table({
  tableName: 'exercises',
  timestamps: true,
})
export default class ExerciseModel extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataTypes.BIGINT,
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
    allowNull: false,
    type: DataTypes.BIGINT,
  })
  public programId: number;

  @BelongsTo(() => ProgramModel)
  public program: ProgramModel;
}
