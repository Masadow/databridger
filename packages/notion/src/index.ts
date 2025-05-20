import { registerProvider, Integration, OAuth2Credentials } from "@ipac/core";
import { Client, PageObjectResponse } from '@notionhq/client';
import { Document, DocumentIntegration, DocumentListOptions } from "packages/core/src/categories/document";
import { AuthorizationCode } from 'simple-oauth2';

export interface NotionOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}

const defaultScopes = [
  'read:databases',
  'read:pages',
];

export class NotionIntegration extends Integration<'notion'> implements DocumentIntegration {
  private scopes: string[];
  private authClient: AuthorizationCode;
  private redirectUri: string;

  constructor(provider: 'notion', options: NotionOptions) {
    super(provider, options);

    this.authClient = new AuthorizationCode({
      client: {
        id: options.clientId,
        secret: options.clientSecret,
      },
      auth: {
        tokenHost: 'https://api.notion.com',
        tokenPath: '/v1/oauth/token',
        authorizePath: '/v1/oauth/authorize',
      },
    });

    this.redirectUri = options.redirectUri;
    this.scopes = options.scopes || defaultScopes;
  }

  async documentList(credentials: OAuth2Credentials, options: DocumentListOptions): Promise<Omit<Document, 'content'>[]> {
    const notion = new Client({
      auth: credentials.accessToken,
    });

    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      page_size: options.limit,
    });

    return response.results.map((r) => {
      const page = r as PageObjectResponse;
      const title = page.properties.title.type === 'title' ? page.properties.title : null;
      return {
        id: page.id,
        name: title?.title[0].plain_text!,
        type: 'Text',
      };
    });
  }

  async documentDetails(credentials: OAuth2Credentials, id: string): Promise<Document | undefined> {
    return undefined;
  };

  getAuthUrl() {
   return this.authClient.authorizeURL({
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
    });
  }

  async authenticate(code: string) {
    const {token} = await this.authClient.getToken({code, redirect_uri: this.redirectUri});
    return {accessToken: token.access_token as string, refreshToken: token.refresh_token as string | null | undefined ?? undefined};
  };
}

declare module '@ipac/core' {
  interface ProviderMap {
    notion: NotionOptions;
  }

  interface IntegrationBehaviorMap {
    notion: NotionIntegration;
  }
}

// Enregistrement automatique au chargement du module
registerProvider('notion', NotionIntegration);