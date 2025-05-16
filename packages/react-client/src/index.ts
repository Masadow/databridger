import { useMemo, useState } from 'react';
import { OAuth2BrowserClient, OAuth2BrowserClientOptions } from '@ipac/client';

export type OAuth2Props<T> = OAuth2BrowserClientOptions & {
  authUri: string;
  verifyUri: string;
  onAuthenticated: (data: T) => void;
}

export const useOAuth2 = <T>({
  clientId,
  clientSecret,
  redirectUri,
  scopes,
  authUri,
  verifyUri,
  onAuthenticated
}: OAuth2Props<T>) => {
  const client = useMemo(() => new OAuth2BrowserClient({clientId, clientSecret, redirectUri, scopes}), [clientId, clientSecret, redirectUri, scopes]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const code = new URLSearchParams(window.location.search).get('code');

  const authenticate = async () => {
    try {
      setLoading(true);
      await client.authenticate(authUri);
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  const verify = async (code: string) => {
    setLoading(true);
    try {
      const data = await client.verify<T>(verifyUri, code);
      onAuthenticated(data);
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  if (code) {
    window.history.replaceState({}, document.title, window.location.pathname);
    verify(code);
  }

  return { error, loading, authenticate };
}
