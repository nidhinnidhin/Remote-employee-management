export interface FormDropdownProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: string[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}