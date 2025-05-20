import express from 'express';
import cors from 'cors';
import { createIntegration } from '@ipac/core';
import '@ipac/gmail';

const gmail = createIntegration('gmail', {
  clientId: process.env.GMAIL_CLIENT_ID || '',
  clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
  redirectUri: 'http://localhost:3000',
});

const app = express();
const port = 3001;

app.use(cors());

app.get('/auth', (_, res) => {
  const authUrl = gmail.getAuthUrl();
  res.send(JSON.stringify({authUrl}));
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code as string;

  try {
    const { accessToken, refreshToken } = await gmail.authenticate(code);
    res.send(JSON.stringify({ accessToken, refreshToken }));
  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(500).send('Authentication failed.');
  }
});

app.get('/emails', async (req, res) => {
  try {
    const authorization = req.query.authorization as string;
    const credentials = { accessToken: authorization, refreshToken: undefined };
    const emails = await gmail.emailList(credentials, { limit: 5 });
    res.json(emails);
  } catch (error) {
    console.error('Failed to fetch emails:', error);
    res.status(500).send('Failed to fetch emails.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
