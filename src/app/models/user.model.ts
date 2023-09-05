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
    type: DataTypes.STRING(200),
  })
  public name: string | null;

  @Column({
    type: DataTypes.STRING(200),
  })
  public surname: string | null;

  @Column({
    type: DataTypes.STRING(200),
  })
  public nickName: string | null;

  @Column({
    allowNull: false,
    unique: true,
    type: DataTypes.STRING(200),
  })
  public email: string;

  @Column({
    allowNull: false,
    type: DataTypes.STRING(200),
  })
  public password: string;

  @Column({
    type: DataTypes.INTEGER(),
  })
  public age: number | null;

  @Column({
    allowNull: false,
    type: DataTypes.ENUM(...Object.values(UserRole)),
  })
  public role: UserRole;
}

export const UserSchema = {
  id: z.number().min(1),
  name: z.string().min(3).max(200).nullable(),
  surname: z.string().min(3).max(200).nullable(),
  nickName: z.string().min(3).max(200).nullable(),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(200)
    .refine((value) => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*]).+$/.test(value), {
      message: 'Password must contain at least one uppercase letter, one number and one special character',
    }),
  age: z.number().min(0).max(200).nullable(),
  role: z.nativeEnum(UserRole),
};

export type UserWithoutPassportModel = Pick<
  UserModel,
  'id' | 'name' | 'surname' | 'nickName' | 'age' | 'email' | 'role'
>;
