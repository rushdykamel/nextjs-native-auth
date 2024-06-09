'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail, updateUser, updateUserPassword } from '@/data/users';
import { createPasswordReset, deleteResetToken } from '@/data/passwordResets';

const expiryInMs = process.env.SESSION_EXPIRY_MS!;
const expiryInText = process.env.SESSION_EXPIRY_Text!;
const secretKey = process.env.ENCRYPT_SECRET!;
const cookieName = process.env.SESSION_COOKIE_NAME!;
const baseDomain = process.env.BASE_DOMAIN!;

const key = new TextEncoder().encode(secretKey);
const hashingAlgorithm = 'HS256';
const saltRounds = 10;

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: hashingAlgorithm })
    .setIssuedAt()
    .setExpirationTime(expiryInText)
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: [hashingAlgorithm],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  // Verify credentials && get the user
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  if (!email || !password) return { error: 'Fields cannot be empty!' };

  const user = await getUserByEmail(email);

  // Check if user exists
  if (!user) {
    return { error: 'Invalid username and/or password' };
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return { error: 'Invalid username and/or password' };
  }

  // Create the session
  const expires = new Date(Date.now() + expiryInMs);
  const session = await encrypt({
    user: { id: user.id, name: user.name },
    expires,
  });

  // Save the session in a cookie
  cookies().set(cookieName, session, { expires, httpOnly: true });
  redirect('/');
}

export async function logout() {
  // Destroy the session
  cookies().set(cookieName, '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get(cookieName)?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function isLoggedIn() {
  const session = await getSession();
  return session !== null;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(cookieName)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + expiryInMs);
  const res = NextResponse.next();
  res.cookies.set({
    name: cookieName,
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function signup(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !name) return { error: 'Fields cannot be empty' };
  if (confirmPassword !== password) return { error: `Passwords don't match` };

  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: 'Account with this email already exists' };

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await createUser(email, hashedPassword, name);

  if (!user) {
    return { error: 'Error happened while creating account, try again later' };
  }

  await login(_currentState, formData);
}

export async function generatePasswordLink(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  if (!email) return { error: 'Email cannot be empty' };

  const result = await createPasswordReset(email);
  const resetLink = `${baseDomain}/signup/forgot-password/${result?.token}`;
  console.log('🚀 ~ generatePasswordLink ~ resetLink:', resetLink);

  return { error: null, success: true };
}

export async function updatePassword(_currentState: unknown, formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const token = formData.get('token') as string;

  if (confirmPassword !== password) return { error: `Passwords don't match` };

  const userId = await deleteResetToken(token);
  if (!userId) return { error: 'Failed to update password' };

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userUpdated = await updateUserPassword(userId, hashedPassword);
  if (!userUpdated) return { error: 'Failed to update password' };

  return { error: null, success: true };
}

export async function updateAccount(_currentState: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  let hashedPassword = '';
  if (formData.get('password')) {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    if (confirmPassword !== password) return { error: `Passwords don't match` };
    const salt = await bcrypt.genSalt(saltRounds);
    hashedPassword = await bcrypt.hash(password, salt);
  }
  
  const session = await getSession();
  if (!session || !session.user) return { error: 'Failed to update account' };

  const userUpdated = await updateUser(session.user.id, name, hashedPassword);
  if (!userUpdated) return { error: 'Failed to update account' };

  return { error: null, success: true };
}


