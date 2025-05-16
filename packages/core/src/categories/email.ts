import { OAuth2Credentials } from "..";

export type Email = {
  id?: string;
  subject: string;
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  date?: Date;
  message: string;
}

export type EmailListOptions = {
  limit?: number;
}

export interface EmailIntegration {
  emailList(credentials: OAuth2Credentials, options: EmailListOptions): Promise<Omit<Email, 'message'>[]>;
  emailDetails(credentials: OAuth2Credentials, id: string): Promise<Email | undefined>;
}