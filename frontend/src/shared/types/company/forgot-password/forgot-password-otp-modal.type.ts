export interface ForgotPasswordOtpModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onVerified: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}