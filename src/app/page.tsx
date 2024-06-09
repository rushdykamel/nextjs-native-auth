import { Button, Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import { getSession, logout } from './lib/auth';
import AuthForm from './components/AuthForm';

export default async function Home() {
  const loggedInUser = await getSession();

  return (
    <>
      {loggedInUser ?
        <AuthForm dispatch={async () => {
          'use server';
          await logout();
          redirect('/login');
        }}>
          <Typography variant='h4'>Welcome {loggedInUser.user.name}</Typography>
          
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }} href="/account">
            Edit account
          </Button>
          <Button type="submit" color="secondary" variant="contained" sx={{ marginTop: 2, marginLeft: 1 }}>
            Logout
          </Button>
        </AuthForm> :
        <AuthForm>
          <Typography variant='h4'>You are not logged in</Typography>
          <Button color="primary" href='/login' variant="contained" sx={{ marginTop: 2 }}>
            Login
          </Button>
        </AuthForm>}
    </>
  );
}