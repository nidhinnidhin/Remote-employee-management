export interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading?: boolean;
  error?: string;
  resending?: boolean;
}
