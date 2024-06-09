'use client';

import { useFormState } from 'react-dom';
import { updateAccount } from '../lib/auth';
import { TextField, Typography, Box, Alert, Button } from '@mui/material';
import SubmitButton from '../components/SubmitButton';
import AuthForm from '../components/AuthForm';
import User from '@/types/user';
import { useEffect, useState } from 'react';

export default function EditAccount({ account }: { account: User }) {
  const [result, dispatch] = useFormState(updateAccount, undefined);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [name, setName] = useState(() => account.name);
  useEffect(() => {
    if (result?.success) setShowPasswordFields(false)
  }, [result])

  return (
    <AuthForm dispatch={dispatch}>
      <Typography component="h2" variant="h5" align="center" fontWeight="bold" mb={3}>
        Edit account
      </Typography>

      <Box mb={2}>
        <TextField
          type="input"
          name="name"
          placeholder="Full name"
          required
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
        />
      </Box>

      <Box>
        <TextField
          type="email"
          name="email"
          placeholder="Email"
          required
          fullWidth
          disabled
          value={account.email}
          variant="outlined"
          helperText="Email field cannot be updated"
        />
      </Box>
      <Box mb={2}>
        <Button
          variant="text"
          color="info"
          sx={{ marginTop: 2 }}
          onClick={() => setShowPasswordFields(prev => !prev)}
          style={{ textTransform: 'none' }}>
          Change password?
        </Button>
      </Box>
      {showPasswordFields && (
        <><Box mb={2}>
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
          </Box></>)}
      {result?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {result.error}
        </Alert>
      )}
      {result?.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Account has been updated successfully
        </Alert>
      )}
      <SubmitButton title="Update" loadingTitle="Updating account..." />
    </AuthForm>
  );
}
