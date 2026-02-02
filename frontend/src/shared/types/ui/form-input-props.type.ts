export interface FormInputProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  required?: boolean;
  placeholder?: string;
}