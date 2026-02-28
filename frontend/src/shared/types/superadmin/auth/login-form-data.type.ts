export interface AdminLoginFormData {
  email: string;
  password: string;
};

export interface AdminLoginErrors {
  email?: string;
  password?: string;
  form?: string;
};