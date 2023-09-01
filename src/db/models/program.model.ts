import { DataTypes } from 'sequelize';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import ExerciseModel from './exercise.model';

@Table({
  tableName: 'programs',
  timestamps: true,
})
export default class ProgramModel extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataTypes.BIGINT,
    autoIncrement: true,
  })
  public declare id: number;

  @Column({
    allowNull: false,
    unique: true,
    type: DataTypes.STRING(200),
  })
  public name: string;

  @HasMany(() => ExerciseModel, 'programId')
  public exercises: ExerciseModel[];
}
