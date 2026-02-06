export interface BaseLoginFormProps {
  title: string;
  registerHref?: string;
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
