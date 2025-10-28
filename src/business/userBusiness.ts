<<<<<<< HEAD
import * as userRepository from '../database/repositories/userRepository';
import { IUser } from '../models/UserModels';

export const getProfile = async (userId: number): Promise<Omit<IUser, 'senha_hash'> | null> => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    return user;
};
=======
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
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123
