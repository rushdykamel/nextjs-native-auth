'use client';

import { useFormState } from 'react-dom';
import { signup } from '../lib/auth';
import { TextField, Typography, Box, Alert } from '@mui/material';
import SubmitButton from '../components/SubmitButton';
import AuthForm from '../components/AuthForm';

export default function Page() {
  const [result, dispatch] = useFormState(signup, undefined);

  return (
    <AuthForm dispatch={dispatch}>
      <Typography component="h2" variant="h5" align="center" fontWeight="bold" mb={3}>
        Sign up
      </Typography>

      <Box mb={2}>
        <TextField
          type="input"
          name="name"
          placeholder="Full name"
          required
          fullWidth
          variant="outlined"
        />
      </Box>

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
          inputProps={{ minLength: 6 }}
          helperText="Password must be at least 6 characters long."
        />
      </Box>

      <Box mb={2}>
        <TextField
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
          fullWidth
          variant="outlined"
          inputProps={{ minLength: 6 }}
        />
      </Box>
      {result?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {result.error}
        </Alert>
      )}
      <SubmitButton title="Sign up" loadingTitle="Creating account..." />
    </AuthForm>
  );
}
