import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Este endpoint solo debería estar disponible en desarrollo
export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const { serviceKey } = await request.json()

    if (!serviceKey) {
      return NextResponse.json(
        { error: 'Service key is required' },
        { status: 400 }
      )
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const PROJECT_REF = 'ppjkkuepigyxjisvizac'

    const results = []

    // 1. Leer schema.sql
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')

    // 2. Ejecutar usando la Management API
    console.log('Ejecutando schema.sql...')

    try {
      const response = await fetch(
        `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: schemaSQL
          })
        }
      )

      const schemaResult = await response.json()

      if (!response.ok) {
        results.push({
          type: 'schema',
          success: false,
          error: JSON.stringify(schemaResult)
        })
      } else {
        results.push({
          type: 'schema',
          success: true,
          message: 'Schema executed successfully'
        })
      }
    } catch (err: any) {
      results.push({
        type: 'schema',
        success: false,
        error: err.message
      })
    }

    // 3. Leer storage.sql
    const storagePath = path.join(process.cwd(), 'supabase', 'storage.sql')
    const storageSQL = fs.readFileSync(storagePath, 'utf8')

    console.log('Ejecutando storage.sql...')

    try {
      const response = await fetch(
        `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: storageSQL
          })
        }
      )

      const storageResult = await response.json()

      if (!response.ok) {
        results.push({
          type: 'storage',
          success: false,
          error: JSON.stringify(storageResult)
        })
      } else {
        results.push({
          type: 'storage',
          success: true,
          message: 'Storage executed successfully'
        })
      }
    } catch (err: any) {
      results.push({
        type: 'storage',
        success: false,
        error: err.message
      })
    }

    const failCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: failCount === 0,
      message: `Setup ${failCount === 0 ? 'completed successfully' : 'completed with errors'}`,
      results
    })
  } catch (error: any) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
