import { DataTypes } from 'sequelize';
import { Column, Table, Model } from 'sequelize-typescript';
import { z } from 'zod';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export default class UserModel extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER(),
    autoIncrement: true,
  })
  public declare id: number;

  @Column({
    allowNull: false,
    type: DataTypes.STRING(200),
  })
  public name: string;

  @Column({
    allowNull: false,
    type: DataTypes.STRING(200),
  })
  public surname: string;

  @Column({
    allowNull: false,
    type: DataTypes.STRING(200),
  })
  public nickName: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataTypes.STRING(200),
  })
  public email: string;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER(),
  })
  public age: number;

  @Column({
    allowNull: false,
    type: DataTypes.ENUM(...Object.values(UserRole)),
  })
  public role: UserRole;
}

export const UserSchema = {
  id: z.number().min(1),
  name: z.string().min(3).max(200),
  surname: z.string().min(3).max(200),
  nickName: z.string().min(3).max(200),
  email: z.string().email(),
  age: z.number().min(0).max(200),
  role: z.nativeEnum(UserRole),
};
