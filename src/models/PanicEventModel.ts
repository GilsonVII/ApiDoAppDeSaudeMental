export interface IPanicEvent {
    id_panico: number;
    usuario_id: number;
    latitude: number;
    longitude: number;
    timestamp: Date; 
}
export interface PanicEventRecord {
  id: number;
  userId: string;
  latitude: number;
  longitude: number;
  contacts: any[];
  createdAt: Date;
}

function parseContactsField(row: any) {
  if (!row || row.contacts == null) return row;
  try {
    if (typeof row.contacts === 'string') {
      row.contacts = JSON.parse(row.contacts);
    }
  } catch (err) {

  }
  return row;
}


export async function createPanicEvent(db: any, data: PanicEventRecord) {
  if (typeof db !== 'function') {
    throw new Error('DB client not supported: expected knex-like client (function)');
  }

  const insertData = {
    user_id: data.userId,
    latitude: data.latitude,
    longitude: data.longitude,
    contacts: JSON.stringify(data.contacts || []),
    created_at: data.createdAt ? data.createdAt.toISOString() : new Date().toISOString()
  };

  try {
   
    const insertResult = await db('panic_events').insert(insertData);

    if (Array.isArray(insertResult) && insertResult.length > 0) {
      const insertedId = insertResult[0];
      const row = await db('panic_events').where('id', insertedId).first();
      return parseContactsField(row);
    }

    const rows = await db('panic_events').where({ user_id: data.userId }).orderBy('created_at', 'desc').limit(1);
    return rows && rows.length > 0 ? parseContactsField(rows[0]) : { ...data, id: null };
  } catch (err) {
    
    throw err;
  }
}


export async function getEmergencyContactsForUser(db: any, userId: string) {
  if (typeof db !== 'function') {
    throw new Error('DB client not supported: expected knex-like client (function)');
  }

  const rows = await db('emergency_contacts').where({ user_id: userId }).select('*');
  return rows || [];
}