import { v4 as uuidv4 } from 'uuid';
import User from '@/types/user';
import db from './db';

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length) return mapUser(result.rows[0]);

    return null;
  } catch (err) {
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length) return mapUser(result.rows[0]);

    return null;
  } catch (err) {

    return null;
  }
}

export async function updateUser(id: string, name: string, password?: string): Promise<boolean> {
  try {

    const query = password ? `UPDATE users set full_name=$1, password=$2 where id=$3` : `UPDATE users set full_name=$1 where id=$2`;
    const updateResult = await db.query(query, password ? [name, password, id] : [name, id]);
    if (updateResult.rowCount === 0) return false;

    return true;
  } catch (err) {
    return false;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User | null> {
  try {
    const newId = uuidv4() as string;
    const insertResult = await db.query(
      'INSERT INTO users(id, email, full_name, password) values ($1, $2, $3, $4)',
      [newId, email, name, password]
    );

    if (insertResult.rowCount === 0) return null;

    const result = await db.query('SELECT * from users where id = $1', [newId]);

    if (result.rows.length) return mapUser(result.rows[0]);

    return null;
  } catch (err) {
    console.log('🚀 ~ createUser error:', err);
    return null;
  }
}

export async function updateUserPassword(id: string, password: string): Promise<boolean> {
  try {
    const updateResult = await db.query('UPDATE users set password = $1 where id = $2', [
      password,
      id,
    ]);

    if (updateResult.rowCount === 0) return false;

    return true;
  } catch (err) {
    return false;
  }
}

function mapUser(user: any): User | null {
  if (!user) return null;

  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    password: user.password,
    dateCreated: user.date_created,
  };
}
