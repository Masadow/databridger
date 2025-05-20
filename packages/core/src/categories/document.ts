import { OAuth2Credentials } from "..";

export type Document = {
  id?: string;
  name: string;
  content: string;
  type: 'Text' | 'Sheet' | 'Pdf' | 'Image' | 'Video' | 'Audio' | 'Other';
}

export type DocumentListOptions = {
  limit?: number;
}

export interface DocumentIntegration {
  documentList(credentials: OAuth2Credentials, options: DocumentListOptions): Promise<Omit<Document, 'content'>[]>;
  documentDetails(credentials: OAuth2Credentials, id: string): Promise<Document | undefined>;
}