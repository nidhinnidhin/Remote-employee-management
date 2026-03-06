export interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginUrl: string;
  onInvite: (data: {
    email: string;
    password: string;
  }) => void;
}