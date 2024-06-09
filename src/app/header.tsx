import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import Open from '@mui/icons-material/LockOpenRounded';
import Locked from '@mui/icons-material/LockClockRounded';
import Home from '@mui/icons-material/HomeRounded';

export default function Header({ loggedInUser }: { loggedInUser: any }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" href="/">
          {loggedInUser ? <Open /> : <Locked />}
        </IconButton>
        <Typography
          variant="h6"
          textTransform={'uppercase'}
          letterSpacing={5}
          pl={2}
          sx={{ flexGrow: 1 }}>
          NextJS native auth
        </Typography>
        {!loggedInUser && (
          <Button color="inherit" href="/login">
            Login
          </Button>
        )}
        {loggedInUser &&
          <>
            <IconButton edge="start" color="inherit" href="/">
              <Home />
            </IconButton>
            <Button variant="text" color="inherit" href='/account/'>{loggedInUser.user.name}</Button>
          </>
        }
      </Toolbar>
    </AppBar>
  );
}
