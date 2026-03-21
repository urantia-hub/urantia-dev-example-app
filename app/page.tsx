'use client'

import { useState, useEffect } from 'react'
import { UrantiaAuth } from '@urantia/auth'

const APP_ID = process.env.NEXT_PUBLIC_URANTIA_APP_ID ?? 'kelson-test-01'
const REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/callback`
  : 'http://localhost:3000/callback'

let auth: UrantiaAuth | null = null
function getAuth() {
  if (!auth) {
    auth = new UrantiaAuth({ appId: APP_ID, redirectUri: REDIRECT_URI })
  }
  return auth
}

function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="248" fill="none" stroke="currentColor" strokeWidth="12.8" opacity="0.25"/>
      <circle cx="256" cy="256" r="208" fill="none" stroke="currentColor" strokeWidth="12.8" opacity="0.35"/>
      <circle cx="256" cy="256" r="168" fill="none" stroke="currentColor" strokeWidth="14.4" opacity="0.50"/>
      <circle cx="256" cy="256" r="128" fill="none" stroke="currentColor" strokeWidth="16.0" opacity="0.65"/>
      <circle cx="256" cy="256" r="88" fill="none" stroke="currentColor" strokeWidth="16.0" opacity="0.80"/>
      <circle cx="256" cy="256" r="51.2" fill="none" stroke="currentColor" strokeWidth="17.6" opacity="0.95"/>
      <circle cx="256" cy="256" r="22.4" fill="currentColor"/>
    </svg>
  )
}

interface SessionData {
  user: { id: string; email: string; scopes: string[] }
  accessToken: string
  expiresAt: string
}

export default function Home() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [ready, setReady] = useState(false)
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    const a = getAuth()
    setSession(a.getSession() as SessionData | null)
    setReady(true)

    return a.onAuthStateChange((s) => {
      setSession(s as SessionData | null)
    })
  }, [])

  if (!ready) {
    return (
      <div className="text-center">
        <Logo className="mx-auto h-10 w-10 animate-pulse text-blue-400" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
          <div className="text-center">
            <Logo className="mx-auto h-14 w-14 text-blue-500" />
            <h1 className="mt-5 text-xl text-white">
              <span className="font-light">Urantia</span><span className="font-bold">Hub</span>
            </h1>
            <p className="mt-2 text-sm text-gray-400">Auth Example</p>
          </div>

          <div className="mt-8 rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-xs leading-relaxed text-gray-500">
              This app demonstrates the <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-blue-400">@urantia/auth</code> SDK.
              Click below to sign in via OAuth and see your session data.
            </p>
          </div>

          <button
            onClick={() => getAuth().signIn({
              mode: 'redirect',
              scopes: ['profile', 'bookmarks', 'notes', 'reading-progress'],
            })}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            Sign in with Urantia
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Powered by <a href="https://urantia.dev" className="text-gray-500 underline hover:text-gray-400">urantia.dev</a>
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            {session.user.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{session.user.email}</p>
            <p className="truncate font-mono text-xs text-gray-500">{session.user.id}</p>
          </div>
        </div>

        {/* Scopes */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Scopes</p>
          <div className="flex flex-wrap gap-1.5">
            {session.user.scopes.map((scope) => (
              <span
                key={scope}
                className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400"
              >
                {scope}
              </span>
            ))}
          </div>
        </div>

        {/* Token preview */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Access Token</p>
          <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2">
            <p className="truncate font-mono text-xs text-gray-400">
              {session.accessToken}
            </p>
          </div>
        </div>

        {/* Expiry */}
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Expires {new Date(session.expiresAt).toLocaleDateString()} at {new Date(session.expiresAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Raw JSON toggle */}
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="mt-4 text-xs text-gray-500 underline hover:text-gray-400"
        >
          {showRaw ? 'Hide' : 'Show'} raw session
        </button>

        {showRaw && (
          <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-gray-800 bg-gray-950 p-3 font-mono text-xs text-gray-400">
            {JSON.stringify(session, null, 2)}
          </pre>
        )}

        {/* Sign out */}
        <button
          onClick={() => { getAuth().signOut(); setSession(null) }}
          className="mt-6 w-full rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
        >
          Sign out
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-gray-600">
        Powered by <a href="https://urantia.dev" className="text-gray-500 underline hover:text-gray-400">urantia.dev</a>
      </p>
    </div>
  )
}
