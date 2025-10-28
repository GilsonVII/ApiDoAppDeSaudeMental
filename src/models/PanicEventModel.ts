export interface PanicEventRecord {
  id?: any;
  userId: string;
  latitude: number;
  longitude: number;
  contacts: any[];
  createdAt: Date;
}

export async function createPanicEvent(db: any, data: PanicEventRecord) {
  // MongoDB
  if (db && typeof db.collection === 'function') {
    const res = await db.collection('panic_events').insertOne({
      userId: data.userId,
      latitude: data.latitude,
      longitude: data.longitude,
      contacts: data.contacts || [],
      createdAt: data.createdAt || new Date()
    });
    const inserted = await db.collection('panic_events').findOne({ _id: res.insertedId });
    return { ...inserted, id: res.insertedId };
  }

  // knex-like / SQL
  if (typeof db === 'function') {
    try {
      const insertData = {
        user_id: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        contacts: JSON.stringify(data.contacts || []),
        created_at: data.createdAt ? data.createdAt.toISOString() : new Date().toISOString()
      };
      const returning = await db('panic_events').insert(insertData).returning('*');
      if (Array.isArray(returning) && returning.length > 0) return returning[0];
      const rows = await db('panic_events').where(insertData).orderBy('created_at', 'desc').limit(1);
      return rows[0];
    } catch (err) {
      await db('panic_events').insert({
        user_id: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        contacts: JSON.stringify(data.contacts || []),
        created_at: data.createdAt ? data.createdAt.toISOString() : new Date().toISOString()
      });
      const rows = await db('panic_events').where({ user_id: data.userId }).orderBy('created_at', 'desc').limit(1);
      return rows[0];
    }
  }

  return { ...data, id: null };
}