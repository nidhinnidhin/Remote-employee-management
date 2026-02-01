import { randomBytes } from 'crypto';

export const generateSecureToken = () => randomBytes(32).toString('hex');
