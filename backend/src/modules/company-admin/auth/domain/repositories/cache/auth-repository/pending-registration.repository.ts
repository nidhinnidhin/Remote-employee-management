import { PendingRegistrationData } from "src/shared/types/cache/pending-registration.type";

export interface PendingRegistrationRepository {
  save(email: string, data: PendingRegistrationData, ttl: number): Promise<void>;
  find(email: string): Promise<PendingRegistrationData | null>;
  delete(email: string): Promise<void>;
}