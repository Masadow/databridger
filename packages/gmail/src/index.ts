import { registerProvider, Integration, OAuth2Credentials } from "@ipac/core";
import { google } from 'googleapis';
import { Email, EmailIntegration, EmailListOptions } from "packages/core/src/categories/email";

export interface GmailOptions {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  scopes?: string[];
}

const defaultScopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
];

type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export class GmailIntegration extends Integration<'gmail'> implements EmailIntegration {
  private scopes: string[];
  private authClient: OAuth2Client;

  constructor(provider: 'gmail', options: GmailOptions) {
    super(provider, options);

    this.authClient = new google.auth.OAuth2(
      options.clientId,
      options.clientSecret,
      options.redirectUri
    );

    this.scopes = options.scopes || defaultScopes;
  }

  async emailList(credentials: OAuth2Credentials, options: EmailListOptions): Promise<Omit<Email, 'message'>[]> {
    this.authClient.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
      scope: this.scopes.join(' '),
    });
    const gmail = google.gmail({ version: 'v1', auth: this.authClient });
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: options.limit,
    });
    const messages = res.data.messages || [];

    return Promise.all(messages.map(async (message) => {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        format: 'full',
        access_token: credentials.accessToken,
        id: message.id!,
      });

      const payload = msg.data.payload;
      const headers = payload?.headers?.reduce<{ [key: string]: string; }>((acc: { [key: string]: string }, header: typeof payload.headers[0]) => {
        if (header.name) {
          acc[header.name.toLowerCase()] = header.value || '';
        }
        return acc;
      }, {});

      return {
        id: message.id ?? undefined,
        subject: headers?.['subject'] || '',
        from: headers?.['from']!,
        to: headers?.['to']?.split(', ') || [],
        cc: headers?.['cc']?.split(', ') || [],
        bcc: headers?.['bcc']?.split(', ') || [],
        date: msg.data.internalDate ? new Date(parseInt(msg.data.internalDate)) : undefined,
      };
    }));
  }

  async emailDetails(credentials: OAuth2Credentials, id: string): Promise<Email | undefined> {
    return undefined;
  };

  getAuthUrl() {
   return this.authClient.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });
  }

  async authenticate(code: string) {
    const {tokens} = await this.authClient.getToken(code);
    return {accessToken: tokens.access_token || '', refreshToken: tokens.refresh_token ?? undefined};
  };
}

declare module '@ipac/core' {
  interface ProviderMap {
    gmail: GmailOptions;
  }

  interface Integration<P extends 'gmail'> extends EmailIntegration {}
}

// Enregistrement automatique au chargement du module
registerProvider('gmail', GmailIntegration);