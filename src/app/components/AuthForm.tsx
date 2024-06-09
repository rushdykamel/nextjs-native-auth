import { ReactNode } from 'react';
import { Container } from '@mui/material';

type AuthFormProps = {
  dispatch?: (payload: FormData) => void;
  children: ReactNode;
};

const AuthForm = ({ dispatch, children }: AuthFormProps) => {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <form
        action={dispatch}
        style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          marginTop: '16px',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        {children}
      </form>
    </Container>
  );
};

export default AuthForm;
