export type OAuth2BrowserClientOptions = {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  scopes?: string[];
};

export class OAuth2BrowserClient {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];

  constructor({
    clientId,
    clientSecret,
    redirectUri,
    scopes,
  }: OAuth2BrowserClientOptions) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri || window.location.origin;
    this.scopes = scopes || [];
  }

  async authenticate(authUrl: string) {
    const response = await fetch(authUrl);
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    window.location = (await response.json()).authUrl;
  }

  async verify<T>(verifyUri: string, code: string): Promise<T> {
    const response = await fetch(`${verifyUri}?${new URLSearchParams({ code })}`);
    if (!response.ok) {
      throw new Error('Failed to verify code');
    }
    return response.json();
  }
}