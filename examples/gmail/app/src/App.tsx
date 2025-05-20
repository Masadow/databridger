import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton"
import { useOAuth2 } from '@databridger/react-client';
import { Loader2 } from "lucide-react";

type Email = {
  subject: string;
  from: string;
  date: string;
}

type OAuth2Credentials = {
  accessToken: string;
  refreshToken?: string;
}

const App = () => {
  const [credentials, setCredentials] = useState<OAuth2Credentials | null>(null);
  const {
    authenticate,
    loading: authLoading,
  } = useOAuth2({
    authUri: 'http://localhost:3001/auth',
    verifyUri: 'http://localhost:3001/auth/callback',
    onAuthenticated: (data: OAuth2Credentials) => {
      setCredentials({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    }
  });

  const [emails, setEmails] = useState<Email[] | undefined>();
  const [loading, setLoading] = useState(false);

  const fetchEmails = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/emails?authorization=${token}&limit=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      const fetchedEmails = await response.json();
      setEmails(fetchedEmails);
    } catch (error) {
      console.error('Erreur lors de la récupération des emails :', error);
      alert('Impossible de récupérer les emails.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (credentials) {
      fetchEmails(credentials.accessToken);
    }
  }, [credentials]);

  return (
    <div className="mt-8 text-center">
      {!credentials ? (
        <Button onClick={authenticate} disabled={authLoading}>
          {authLoading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : null}
          Connect to gmail
        </Button>
      ) : (
        <>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
            Last emails
          </h4>
          {loading || authLoading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : emails?.length === 0 ? (
            <p>No email found.</p>
          ) : (
            emails?.map((email, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <CardTitle>{email.subject}</CardTitle>
                  <CardDescription>From {email.from} on {new Date(email.date).toLocaleString()}</CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default App
