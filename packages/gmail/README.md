# Setting Up Gmail API in DataBridger

Follow these steps to set up the Gmail API for the DataBridger project:

## Prerequisites
1. Ensure you have a Google Cloud account.
2. Install the [Google Client Library for Node.js](https://github.com/googleapis/google-api-nodejs-client).

## Steps
1. **Enable the Gmail API**:
  - Go to the [Google Cloud Console](https://console.cloud.google.com/).
  - Create a new project or select an existing one.
  - Navigate to **APIs & Services > Library**.
  - Search for "Gmail API" and click **Enable**.

2. **Create Credentials**:
  - Go to **APIs & Services > Credentials**.
  - Click **Create Credentials** and select **OAuth 2.0 Client IDs**.
  - Configure the consent screen and download the `credentials.json` file.

3. **Set Up Environment**:
  - Place the `credentials.json` file in the root of your project.
  - Add the following environment variables to your `.env` file:
    ```env
    GMAIL_CLIENT_ID=<your-client-id>
    GMAIL_CLIENT_SECRET=<your-client-secret>
    GMAIL_REDIRECT_URI=<your-redirect-uri>
    GMAIL_REFRESH_TOKEN=<your-refresh-token>
    ```

4. **Authenticate and Test**:
  - Use the Google Client Library to authenticate and test the Gmail API.
  - Refer to the [Gmail API Documentation](https://developers.google.com/gmail/api) for detailed usage.

## Example Code
```javascript
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// Set credentials
oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Example: List messages
async function listMessages() {
  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res.data);
}

listMessages().catch(console.error);
```

## Notes
- Ensure your `credentials.json` file is not exposed in version control.
- For production, securely manage your environment variables.
