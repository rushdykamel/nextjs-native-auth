import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { getUserByEmail } from './users';
import PasswordReset from '@/types/passwordReset';
import User from '@/types/user';

export async function createPasswordReset(email: string): Promise<{token?: string, user?: User} | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const userId = user.id;

  const selectResult = await db.query(`SELECT * from password_resets where user_id = $1`, [userId]);

  if (selectResult.rows.length) {
    await db.query(`DELETE from password_resets where user_id = $1`, [userId]);
  }

  const token = uuidv4() as string;
  const insertResult = await db.query(
    `INSERT INTO password_resets (user_id, reset_token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 minute')`,
    [userId, token]
  );

  if (insertResult.rowCount === 0) return null;

  return { token, user };
}

export async function verifyResetToken(token: string) {
  const result = await db.query(`SELECT * from password_resets where reset_token = $1`, [token]);

  if (!result.rows.length) return false;

  const resetRecord = mapPasswordReset(result.rows[0]);
  if (!resetRecord) return false;

  const currentTime = new Date();
  console.log(resetRecord.expiresAt);
  if (currentTime > resetRecord.expiresAt) {
    return false;
  }

  return true;
}

export async function deleteResetToken(token: string) {
  const selectResult = await db.query(`SELECT * from password_resets where reset_token = $1`, [
    token,
  ]);

  if (!selectResult.rows.length) return null;

  const userId = mapPasswordReset(selectResult.rows[0])?.userId;

  await db.query(`DELETE from password_resets where reset_token = $1`, [token]);

  return userId;
}

function mapPasswordReset(resetObj: any): PasswordReset | null {
  if (!resetObj) return null;

  return {
    id: resetObj.id,
    token: resetObj.reset_token,
    userId: resetObj.user_id,
    expiresAt: resetObj.expires_at,
  };
}
