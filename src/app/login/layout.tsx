import { redirect } from 'next/navigation';
import { isLoggedIn } from '../lib/auth';

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await isLoggedIn();
  if (loggedIn) redirect('/');

  return children;
}
