export interface ForgotPasswordEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string) => Promise<void>;
}