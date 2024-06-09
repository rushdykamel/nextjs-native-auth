'use client';

import { useFormState } from 'react-dom';
import { updatePassword } from '@/app/lib/auth';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';

import { useParams } from 'next/navigation';
import SubmitButton from '@/app/components/SubmitButton';
import AuthForm from '@/app/components/AuthForm';

export default function Page() {
  const [result, dispatch] = useFormState(updatePassword, undefined);
  const params = useParams();

  return (
    <AuthForm dispatch={dispatch}>
      <Typography component="h2" variant="h5" align="center" fontWeight="bold" mb={3}>
        Update your passowrd
      </Typography>

      <Box mb={2}>
        <TextField
          type="password"
          name="password"
          placeholder="New password"
          required
          fullWidth
          variant="outlined"
          inputProps={{ minLength: 6 }}
          helperText="Password must be at least 6 characters long."
          disabled={result?.success}
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
          disabled={result?.success}
        />
      </Box>
      {result?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {result.error}
        </Alert>
      )}

      {result?.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Passowrd has been updated successfully <Button href="/login">Login</Button>
        </Alert>
      )}
      <input type="hidden" name="token" value={params.token}></input>
      <SubmitButton
        disabled={!!result?.success}
        title="Submit"
        loadingTitle="Updating password..."
      />
    </AuthForm>
  );
}
