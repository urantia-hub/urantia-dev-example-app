'use client'

import { useEffect, useState } from 'react'
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

export default function Callback() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAuth().handleCallback()
      .then(() => {
        window.location.href = '/'
      })
      .catch((err) => {
        setError(err.message)
      })
  }, [])

  if (error) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-sm text-red-400">{error}</p>
        <a href="/" className="mt-4 inline-block text-sm text-gray-500 underline hover:text-gray-400">
          Try again
        </a>
      </div>
    )
  }

  return (
    <div className="text-center">
      <svg className="mx-auto h-10 w-10 animate-pulse text-blue-400" viewBox="0 0 512 512">
        <circle cx="256" cy="256" r="248" fill="none" stroke="currentColor" strokeWidth="12.8" opacity="0.25"/>
        <circle cx="256" cy="256" r="208" fill="none" stroke="currentColor" strokeWidth="12.8" opacity="0.35"/>
        <circle cx="256" cy="256" r="168" fill="none" stroke="currentColor" strokeWidth="14.4" opacity="0.50"/>
        <circle cx="256" cy="256" r="128" fill="none" stroke="currentColor" strokeWidth="16.0" opacity="0.65"/>
        <circle cx="256" cy="256" r="88" fill="none" stroke="currentColor" strokeWidth="16.0" opacity="0.80"/>
        <circle cx="256" cy="256" r="51.2" fill="none" stroke="currentColor" strokeWidth="17.6" opacity="0.95"/>
        <circle cx="256" cy="256" r="22.4" fill="currentColor"/>
      </svg>
      <p className="mt-4 text-sm text-gray-500">Signing you in...</p>
    </div>
  )
}
