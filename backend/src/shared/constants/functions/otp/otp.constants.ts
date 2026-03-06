export const OTP_TTL_MS = 60_000;          // 1 minute
export const SESSION_TTL_SECONDS = 900;    // 15 minutes

export const getOtpExpiresAt = (): Date => new Date(Date.now() + OTP_TTL_MS);