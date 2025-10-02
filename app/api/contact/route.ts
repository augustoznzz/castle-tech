import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const fromEmail = String(body?.email || '').trim()
    const fromName = String(body?.name || '').trim()
    const subject = String(body?.subject || '').trim()
    const message = String(body?.message || '').trim()

    if (!fromEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
      return NextResponse.json({ ok: false, error: 'E-mail inválido' }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ ok: false, error: 'A mensagem é obrigatória' }, { status: 400 })
    }

    const sent = await sendContactEmail({ fromEmail, fromName, subject, message })
    if (!sent) return NextResponse.json({ ok: false, error: 'Falha ao enviar' }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'falhou' }, { status: 500 })
  }
}


