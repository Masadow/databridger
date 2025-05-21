# DataBridger

[![npm](https://img.shields.io/npm/v/@databridger/core)](https://www.npmjs.com/package/@databridger/core)

> **Integration Platform As Code**
> Get unified access to business data sources through a programmable, type-safe interface.
> No vendor lock-in. No black box. 100% open source.

---

## 🧠 What is DataBridger?

**DataBridger** is an open-source library that lets you integrate, normalize, and synchronize data from multiple SaaS tools (Gmail, Notion, Google Drive, Stripe, Outlook...) using a common code interface.

Built for developers who want to:
- Connect authenticated user accounts to external APIs fast
- Normalize disparate data structures across data providers
- Integrate without hassle one or more platform
- Inject normalized data into vector databases or LLM pipelines (ideal for RAG workflows)
- Do it **without paying for iPaaS platforms**

---

## ❓ Why DataBridger?

- ✅ **No vendor lock-in** – You host it, you control it.
- 💸 **Zero runtime costs** – Avoid per-user/per-call pricing from iPaaS platforms, integrate into your architecture instead.
- 🧠 **LLM-ready** – Normalize and inject your data into vector DBs or pipelines easily.
- 🧱 **Composable architecture** – Add only the providers you need.
- 👨‍💻 **Dev-first DX** – Written in TypeScript, fully typed, and open-source.

Unlike GUI-heavy solutions or hosted black boxes, DataBridger is for engineers who value control, extensibility, and cost-efficiency.

---

## ✨ Features

- 🔐 **OAuth2 / Token refresh built-in**
- 🧩 **Unified typed interfaces** (`DocumentIntegration`, `EmailIntegration`, etc.)
- 🔌 **Pluggable providers** (Gmail, Notion, Outlook, etc.)
- 🛠️ **Native SDK compatibility** for custom low-level access
- 🔎 Designed for **AI, automation, and data ingestion** but can serve any data pipeline purpose

---

## 🔧 Example usage

```
npm i @databridger/core @databridger/all
```

```ts
import express from 'express'
import bodyParser from 'body-parser'
import { createIntegration } from '@databridger/core'
import '@databridger/all'

const app = express()
app.use(bodyParser.json())

const gmailConfig = {
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: ,
};

app.post('/integration-authorize', (req, res) => {
  const integration = createIntegration('gmail', gmailConfig)

  const authUrl = integration.getAuthUrl()
  res.json({ authUrl })
})

app.post('/integration-exchange-token', async (req, res) => {
  const { code } = req.body

  const integration = createIntegration('gmail', gmailConfig)

  // Store or process credentials as needed
  const credentials = await integration.authenticate(code)

  // Use our unified API across all providers
  integration.emailList({ limit: 5 });

  // Or use the native API without hassle
  integration.native.users.messages.get({
    userId: 'me',
    format: 'full',
    access_token: credentials.accessToken,
    id: '123',
  });

  res.json({ success: true })
})

app.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}`)
})
```

## 🔧 Working with multiple providers in a single code base?

```ts
import express from 'express'
import bodyParser from 'body-parser'
import { createIntegration } from '@databridger/core'
import '@databridger/all'
import integrations from './integrations.json' assert { type: 'json' }

const app = express()
app.use(bodyParser.json())

app.post('/integration-authorize', (req, res) => {
  const { provider } = req.body

  const integration = createIntegration(provider, integrations[provider])

  const authUrl = integration.getAuthUrl()
  res.json({ authUrl })
})

app.post('/integration-exchange-token', async (req, res) => {
  const { provider, code } = req.body

  const integration = createIntegration(provider, integrations[provider])

  // Store or process credentials as needed
  const credentials = await integration.authenticate(code)

  res.json({ success: true })
})

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`)
})
```

---

## 📦 Structure

```
packages/
├── core/            # Token management, utilities
├── all/             # Utility to import every integrations
├── client/          # Frontend utility to work with OAuth
├── react-client/    # Convenient hook to encaspulate client
├── gmail/           # Gmail adapter
├── notion/          # Notion adapter
└── ...
```

---

## 👥 Contributing

We’re building a **developer-first integration layer** — contributions are welcome:

- Add a new provider (`@databridger/stripe`, `@databridger/trello`, etc.)
- Improve interface typing
- Write examples & tests
- Help define new standard interfaces
- Enhance API Documentation

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

DataBridger is maintained by the creators of [Kaeron](https://kaeron.ai), the angel assistant for small business operations.
This library powers our connector layer and is open for the community.
