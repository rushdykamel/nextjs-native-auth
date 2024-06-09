type PasswordReset = {
  id: string
  userId: string
  token: string
  expiresAt: Date
}

export default PasswordReset;