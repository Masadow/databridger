import { NotionAdapter } from '@ipac/notion';
import type { DocumentProvider } from 'packages/core/src';

const main = async () => {
  const notion = new NotionAdapter({ token: 'your-notion-token' });

  const docs = await notion.listDocuments();
  console.log('Documents:', docs);
};

main().catch(console.error);