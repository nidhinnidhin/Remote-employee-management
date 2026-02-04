import { InviteEmployeePayload } from "./invite-employee-payload.type";

export interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteEmployeePayload) => void;
}