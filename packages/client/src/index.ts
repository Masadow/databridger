export type OAuth2BrowserClientOptions = {
  authUri: string;
  verifyUri: string;
  scopes?: string[];
};

export class OAuth2BrowserClient {
  authUri: string;
  verifyUri: string;
  scopes: string[];

  constructor({authUri, verifyUri, scopes}: OAuth2BrowserClientOptions) {
    this.authUri = authUri;
    this.verifyUri = verifyUri;
    this.scopes = scopes || [];
  }

  async authenticate() {
    const response = await fetch(this.authUri);
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    window.location = (await response.json()).authUrl;
  }

  async verify<T>(code: string): Promise<T> {
    const response = await fetch(`${this.verifyUri}?${new URLSearchParams({ code })}`);
    if (!response.ok) {
      throw new Error('Failed to verify code');
    }
    return response.json();
  }
}