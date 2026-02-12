import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_failed`)
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        const fullName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User'

        await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            role: 'driver',
            full_name: fullName,
            email_notifications: true,
            sms_notifications: false
          }])

        return NextResponse.redirect(`${requestUrl.origin}/driver`)
      }

      if (profile.role === 'driver') {
        return NextResponse.redirect(`${requestUrl.origin}/driver`)
      } else if (profile.role === 'host') {
        return NextResponse.redirect(`${requestUrl.origin}/host`)
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin)
}
