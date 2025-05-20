import express from 'express';
import cors from 'cors';
import { createIntegration } from '@databridger/core';
import '@databridger/notion';

const notion = createIntegration('notion', {
  clientId: process.env.NOTION_CLIENT_ID || '',
  clientSecret: process.env.NOTION_CLIENT_SECRET || '',
  redirectUri: 'http://localhost:3000',
});

const app = express();
const port = 3001;

app.use(cors());

app.get('/auth', (_, res) => {

  const authUrl = notion.getAuthUrl();
  res.send(JSON.stringify({authUrl}));
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code as string;

  try {
    const { accessToken, refreshToken } = await notion.authenticate(code);
    res.send(JSON.stringify({ accessToken, refreshToken }));
  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(500).send('Authentication failed.');
  }
});

app.get('/documents', async (req, res) => {
  try {
    const authorization = req.query.authorization as string;
    const credentials = { accessToken: authorization, refreshToken: undefined };
    const docs = await notion.documentList(credentials, { limit: 5 });
    res.json(docs);
  } catch (error) {
    console.error('Failed to fetch emails:', error);
    res.status(500).send('Failed to fetch emails.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
