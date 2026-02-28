export type PendingRegistrationData = {
  otpHash: string;
  expiresAt: Date;

  admin: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  };

  company?: {
    name: string;
    email: string;
    size: string;
    industry: string;
    website?: string;
  };
};
