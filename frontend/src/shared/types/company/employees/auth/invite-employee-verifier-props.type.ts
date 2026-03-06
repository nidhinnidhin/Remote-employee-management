export interface InviteVerifierProps {
  token: string;
}

export interface VerifyEmployeeInviteResponse {
  nextStep: "SET_PASSWORD" | "LOGIN";
}