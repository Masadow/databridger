# IPAC

> **Integration Platform As Code**  
> Get unified access to business data sources through a programmable, type-safe interface.

---

## 🧠 What is IPAC?

**IPAC** is an open-source library that lets you integrate, normalize, and synchronize data from multiple SaaS tools (Gmail, Notion, Google Drive, Stripe, Outlook...) using a common code interface.

Built for developers who need to:
- Connect authenticated user accounts to external APIs
- Normalize disparate data structures
- Inject data into vector databases or LLM pipelines (RAG-ready)
- Do it **without paying for iPaaS platforms**

---

## ✨ Features

- 🔐 **OAuth2 / Token refresh built-in**
- 🧩 **Unified typed interfaces** (`IpacMail`, `IpacDocs`, `IpacFinance`, etc.)
- 🔌 **Pluggable providers** (Gmail, Notion, Outlook, etc.)
- 🛠️ **Native SDK compatibility** for custom low-level access
- 🔎 Designed for **AI, automation, and data ingestion**

---

## 🔧 Example usage

```ts
import { GmailAdapter } from '@ipac/gmail';
import type { IpacMail } from '@ipac/types';

const client: IpacMail = new GmailAdapter({ accessToken: '...' });

const threads = await client.listThreads({ unreadOnly: true });
const message = await client.readMessage(threads[0].id);
await client.sendMessage({
  to: ['client@example.com'],
  subject: 'Re: Your request',
  body: 'Hello, here’s the info you asked for...',
});
```

---

## 📦 Structure

```
packages/
├── core/            # Token management, utilities
├── types/           # Common interfaces (Mail, Docs, CRM, etc.)
├── gmail/           # Gmail adapter implementing IpacMail
├── notion/          # Notion adapter implementing IpacDocuments
└── ...
```

---

## 📚 Interfaces

Example: `IpacMail` (shared by Gmail, Outlook, etc.)

```ts
export interface IpacMail {
  listThreads(params?: { unreadOnly?: boolean }): Promise<MailThread[]>;
  readMessage(threadId: string): Promise<MailMessage>;
  sendMessage(message: MailToSend): Promise<void>;
  deleteThread(threadId: string): Promise<void>;
}
```

---

## 🚀 Roadmap

- [x] First interface: `IpacMail`
- [ ] Gmail and Outlook implementations
- [ ] TokenStore (Supabase, Redis, etc.)
- [ ] `IpacDocuments` for Notion, Drive, Dropbox
- [ ] CLI to scaffold new providers
- [ ] Contribution guide & plugin registry

---

## 👥 Contributing

We’re building a **developer-first integration layer** — contributions are welcome:

- Add a new provider (`@ipac/stripe`, `@ipac/trello`, etc.)
- Improve interface typing
- Write examples & tests
- Help define new standard interfaces

👉 See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🛡 License

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)

This project is licensed under the [**Apache License 2.0**](https://www.apache.org/licenses/LICENSE-2.0).  
You are free to use, modify, distribute, and integrate it in commercial or open-source software.

> Contributors grant a patent license under the terms of Apache 2.0.  
> In case of a patent claim against the project, their license is automatically revoked.

---

## 📣 About

IPAC is maintained by the creators of [Kaeron](https://kaeron.ai), the angel assistant for small business operations.  
This library powers our connector layer and is now open for the community.
