export interface PendingRegistrationData {
  otp: string;
  company: {
    name: string;
    email: string;
    size: string;
    industry: string;
    website?: string;
  };
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  };
}