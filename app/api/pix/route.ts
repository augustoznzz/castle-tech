import { NextRequest, NextResponse } from 'next/server'

// Simple Pix checkout proxy: returns a pre-configured InfinityPay Pix link or code.
// In a real-world scenario, you could generate the dynamic link via your PSP API.

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount } = await req.json()

    // You could validate orderId/amount and persist an order as PENDING here
    // For now, we return the provided Nubank Pix link/code.
    const checkoutUrl = 'https://nubank.com.br/cobrar/1je4n0/68de9a45-1626-47c4-8fdb-234cb132e504'
    const pixCode = '00020126580014BR.GOV.BCB.PIX0136c72bec21-d9f5-441c-ae7b-a3df347931005204000053039865802BR5922Augusto Pires Zuanazzi6009SAO PAULO62140510r4NO7e575F63043C87'

    // If you have a hosted payment URL from InfinityPay, you can also expose it:
    // Example (placeholder):
    // const checkoutUrl = `https://pay.infinitepay.io/seu-link?ref=${encodeURIComponent(orderId || '')}`

    return NextResponse.json({
      // Prefer hosted URL when available; else expose pixCode to render QR in-app
      checkoutUrl,
      pixCode,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Pix checkout failed' }, { status: 500 })
  }
}



