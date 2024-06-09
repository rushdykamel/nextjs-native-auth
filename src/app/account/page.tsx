import { redirect } from 'next/navigation';
import { getSession } from '../lib/auth';
import { getUserById } from '@/data/users';
import EditAccount from './EditAccount';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  const account = await getUserById(session.user.id);
  if (!account) redirect('/login');
  return (
    <EditAccount account={account} />
  );
}
