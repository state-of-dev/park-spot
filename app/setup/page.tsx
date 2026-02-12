'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function SetupPage() {
  const [serviceKey, setServiceKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleSetup = async () => {
    if (!serviceKey) {
      alert('Please enter the service key')
      return
    }

    setLoading(true)
    setResults(null)

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serviceKey })
      })

      const data = await response.json()
      setResults(data)
    } catch (error: any) {
      setResults({
        success: false,
        message: error.message,
        results: []
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Supabase Setup</CardTitle>
            <CardDescription>
              Configure your Supabase database automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertDescription className="text-yellow-200">
                <strong>Required:</strong> Get your Service Role Key from{' '}
                <a
                  href="https://ppjkkuepigyxjisvizac.supabase.co/project/ppjkkuepigyxjisvizac/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Supabase Settings → API
                </a>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="serviceKey">Service Role Key (Secret)</Label>
              <Input
                id="serviceKey"
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={serviceKey}
                onChange={(e) => setServiceKey(e.target.value)}
                className="bg-black font-mono text-sm"
              />
              <p className="text-xs text-zinc-500">
                This key is only used once and never stored
              </p>
            </div>

            <Button
              onClick={handleSetup}
              disabled={loading || !serviceKey}
              className="w-full"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Setting up...' : 'Run Setup'}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                {results.success ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Setup Completed
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    Setup Failed
                  </>
                )}
              </CardTitle>
              <CardDescription>{results.message}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.results?.map((result: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 rounded-lg border p-3 ${
                      result.success
                        ? 'border-green-500/30 bg-green-500/10'
                        : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                    )}
                    <div className="flex-1 space-y-1">
                      <p className="font-mono text-xs text-zinc-400">
                        {result.statement}
                      </p>
                      {result.error && (
                        <p className="text-xs text-red-400">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {results.success && (
                <div className="mt-6 space-y-2">
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <AlertDescription className="text-green-200">
                      <strong>Next steps:</strong>
                      <ol className="ml-4 mt-2 list-decimal space-y-1">
                        <li>
                          Go to{' '}
                          <a
                            href="https://ppjkkuepigyxjisvizac.supabase.co/project/ppjkkuepigyxjisvizac/settings/auth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Auth Settings
                          </a>
                        </li>
                        <li>Disable &quot;Enable email confirmations&quot;</li>
                        <li>Test the signup flow</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-white">What this does</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-400">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>Creates profiles, spots, bookings, payments tables</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>Sets up Row Level Security (RLS) policies</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>Creates storage bucket for spot photos</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>Configures storage policies</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
