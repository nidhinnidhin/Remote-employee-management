export type RegisterCompanyPayload = {
  company: {
    name: string;
    email: string;
    size: string;
    industry: string;
    website: string | null;
  };
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  };
};
