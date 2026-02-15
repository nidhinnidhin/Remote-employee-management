import { randomBytes, createHash } from 'crypto';

export const generateSecureToken = () => {
  const rawToken = randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);

  return { rawToken, hashedToken };
};

export const hashToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};
