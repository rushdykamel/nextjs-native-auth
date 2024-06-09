'use client';

import { useFormState } from 'react-dom';
import { login } from '../lib/auth';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import SubmitButton from '../components/SubmitButton';
import AuthForm from '../components/AuthForm';

export default function Page() {
  const [result, dispatch] = useFormState(login, undefined);

  return (
    <AuthForm dispatch={dispatch}>
      <Typography component="h2" variant="h5" align="center" fontWeight="bold" mb={3}>
        Login
      </Typography>
      <Box mb={2}>
        <TextField
          type="email"
          name="email"
          placeholder="Email"
          required
          fullWidth
          variant="outlined"
        />
      </Box>
      <Box mb={2}>
        <TextField
          type="password"
          name="password"
          placeholder="Password"
          required
          fullWidth
          variant="outlined"
        />
      </Box>
      {result?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {result.error}
        </Alert>
      )}
      <SubmitButton title="Login" loadingTitle="Logging in..." />
      <Button variant="contained" color="secondary" fullWidth sx={{ marginTop: 2 }} href="/signup">
        Sign up
      </Button>

      <Button
        variant="text"
        color="info"
        sx={{ marginTop: 2 }}
        href="/signup/forgot-password"
        style={{ float: 'right', textTransform: 'none' }}>
        Forgot your password?
      </Button>
    </AuthForm>
  );
}
