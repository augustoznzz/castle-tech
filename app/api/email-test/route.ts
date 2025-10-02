import { NextRequest, NextResponse } from 'next/server'
import { sendProductKeysEmail, testEmailConfig } from '@/lib/email'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const ok = await testEmailConfig()
    return NextResponse.json({ ok })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const to = String(body?.to || '')
    if (!to) return NextResponse.json({ error: 'Missing to' }, { status: 400 })

    const sent = await sendProductKeysEmail({
      customerEmail: to,
      orderId: 'test_order',
      total: 0,
      currency: 'brl',
      productKeys: [{ productTitle: 'Test Product', key: 'TEST-KEY-1234' }],
    })
    return NextResponse.json({ sent })
  } catch (e: any) {
    return NextResponse.json({ sent: false, error: e?.message || 'failed' }, { status: 500 })
  }
}


