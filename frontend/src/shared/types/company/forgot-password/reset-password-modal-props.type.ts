export interface ResetPasswordModalProps{
  isOpen: boolean;
  onClose: () => void;
  onReset: (password: string) => Promise<void>;
}