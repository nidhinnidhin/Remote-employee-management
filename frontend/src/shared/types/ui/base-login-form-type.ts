export interface BaseLoginFormProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  registerHref?: string;
  maxWidth?: string;
  formData: {
    email: string;
    password: string;
  };
  errors: {
    email?: string;
    password?: string;
    form?: string;
  };
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword?: () => void;
}
