export interface UserRecord {
  id?: any;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export async function getById(db: any, userId: string) {
  if (db && typeof db.collection === 'function') {
    const user = await db.collection('users').findOne({ _id: userId }) || await db.collection('users').findOne({ id: userId });
    return user;
  }

  if (typeof db === 'function') {
    const user = await db('users').where({ id: userId }).first();
    return user;
  }

  return null;
}