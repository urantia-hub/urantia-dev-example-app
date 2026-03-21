# Urantia Auth Example

A minimal Next.js app demonstrating OAuth authentication with [`@urantia/auth`](https://www.npmjs.com/package/@urantia/auth).

## Prerequisites

1. **Register your app** at [accounts.urantiahub.com/apps](https://accounts.urantiahub.com/apps)
   - Sign in (or create an account)
   - Click **Create app**
   - Choose an App ID (e.g. `my-reading-app`)
   - Add `http://localhost:3000/callback` as a Redirect URI
   - Select the scopes your app needs
   - Save your **App Secret** — it's only shown once

2. **Node.js 18+** installed

## Setup

```bash
# Clone and install
git clone <this-repo>
cd urantia-dev-example-app
npm install

# Set your App ID (optional — defaults to demo app)
export NEXT_PUBLIC_URANTIA_APP_ID=my-reading-app

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Sign in with Urantia**.

## How it works

1. User clicks "Sign in with Urantia"
2. `@urantia/auth` redirects to `accounts.urantiahub.com/login` with PKCE challenge
3. User signs in (email magic link or Google)
4. Consent screen shows requested scopes
5. User clicks Allow → redirected back to `/callback` with an auth code
6. SDK exchanges the code for a JWT access token (7-day expiry)
7. Session is stored in localStorage and available via `auth.getSession()`

## Project structure

```
app/
  layout.tsx        # Root layout with Lato font + Tailwind
  page.tsx          # Sign-in button (signed out) / session card (signed in)
  callback/
    page.tsx        # Handles OAuth redirect, exchanges code for token
  globals.css       # Tailwind imports
```

## Key code

```typescript
import { UrantiaAuth } from '@urantia/auth'

const auth = new UrantiaAuth({
  appId: 'my-reading-app',
  redirectUri: 'http://localhost:3000/callback',
})

// Start OAuth flow
await auth.signIn({
  mode: 'redirect',
  scopes: ['profile', 'bookmarks', 'notes'],
})

// On callback page
await auth.handleCallback()

// Get session anywhere
const session = auth.getSession()
// { user: { id, email, scopes }, accessToken, expiresAt }
```

## Available scopes

| Scope | Description |
|-------|-------------|
| `profile` | Read your profile information |
| `bookmarks` | Read and write your bookmarks |
| `notes` | Read and write your notes |
| `reading-progress` | Read and write your reading progress |
| `preferences` | Read and write your preferences |
| `app-data` | Read and write your app data |

## Links

- [API Docs](https://urantia.dev) — Full API reference
- [`@urantia/auth` on npm](https://www.npmjs.com/package/@urantia/auth) — SDK package
- [`@urantia/api` on npm](https://www.npmjs.com/package/@urantia/api) — API client package
- [Developer Portal](https://accounts.urantiahub.com/apps) — Register and manage your apps
