import * as UserModel from '../models/UserModel';

export async function getProfile(db: any, userId: string) {
  const user = await UserModel.getById(db, userId);
  if (!user) throw new Error('User not found');

  if ('password' in user) {
    const { password, ...rest } = user as any;
    return rest;
  }
  return user;
}