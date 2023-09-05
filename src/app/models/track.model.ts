import { DataTypes } from 'sequelize';
import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import ExerciseModel from './exercise.model';
import UserModel from './user.model';

@Table({
  tableName: 'tracks',
  timestamps: true,
})
export default class TrackModel extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER(),
    autoIncrement: true,
  })
  public declare id: number;

  @ForeignKey(() => ExerciseModel)
  @Column({
    allowNull: false,
    type: DataTypes.INTEGER(),
  })
  public exerciseId: number;

  @ForeignKey(() => UserModel)
  @Column({
    allowNull: false,
    type: DataTypes.INTEGER(),
  })
  public userId: number;

  @Column({
    allowNull: false,
    type: DataTypes.DATE(),
  })
  public dateCompletion: Date;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER(),
  })
  public duration: number;

  @BelongsTo(() => ExerciseModel)
  public exercise: ExerciseModel;

  @BelongsTo(() => UserModel)
  public user: UserModel;
}
