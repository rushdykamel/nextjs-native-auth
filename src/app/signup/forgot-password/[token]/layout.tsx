import { redirect } from 'next/navigation';
import { verifyResetToken } from '@/data/passwordResets';
export default async function LoginLayout({
  params,
  children,
}: Readonly<{
  params: { token: string };
  children: React.ReactNode;
}>) {
  const isValid = await verifyResetToken(params.token);
  if (!isValid) redirect('/404');

  return children;
}
