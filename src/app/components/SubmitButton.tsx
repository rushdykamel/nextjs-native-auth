'use client';

import Button from '@mui/material/Button';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  title?: string;
  loadingTitle?: string;
  disabled?: boolean;
};

const SubmitButton = ({
  disabled = false,
  title = 'Submit',
  loadingTitle = 'Submitting...',
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <Button
      type="submit"
      onClick={handleClick}
      fullWidth
      variant="contained"
      color="primary"
      disabled={pending || disabled}
      sx={{ py: 2 }}>
      {pending ? loadingTitle : title}
    </Button>
  );
};

export default SubmitButton;
