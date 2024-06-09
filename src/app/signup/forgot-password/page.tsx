'use client';

import { useFormState } from 'react-dom';
import { generatePasswordLink } from '../../lib/auth';
import { Container, TextField, Typography, Box, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import SubmitButton from '@/app/components/SubmitButton';
import AuthForm from '@/app/components/AuthForm';

export default function Page() {
  const [result, dispatch] = useFormState(generatePasswordLink, undefined);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (result?.success) setEmail('');
  }, [result]);

  return (
    <AuthForm dispatch={dispatch}>
      <Typography component="h2" variant="h5" align="center" fontWeight="bold" mb={3}>
        Forgotton password
      </Typography>

      <Typography variant="subtitle1" mb={2}>
        Submit your email address to receive instructions on how to reset your password
      </Typography>
      <Box mb={2}>
        <TextField
          type="email"
          name="email"
          placeholder="Email"
          required
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>
      {result?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {result.error}
        </Alert>
      )}

      {result?.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Instrunction have been sent to your email address, make sure to check your junk folder
        </Alert>
      )}
      <SubmitButton title="Submit" loadingTitle="Submitting..." />
    </AuthForm>
  );
}
