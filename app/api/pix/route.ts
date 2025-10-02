import { NextRequest, NextResponse } from 'next/server'

// Simple Pix checkout proxy: returns a pre-configured InfinityPay Pix link or code.
// In a real-world scenario, you could generate the dynamic link via your PSP API.

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount } = await req.json()

    // You could validate orderId/amount and persist an order as PENDING here
    // For now, we return the provided static Pix link/code.
    const infinityPayCode = '00020101021226840014BR.GOV.BCB.PIX01362e69b3e8-28f0-46a7-b674-e6676de0d9ac0222Pagamento augusto_zuan52040000530398654071200.005802BR5922AUGUSTO PIRES ZUANAZZI6013FLORIANOPOLIS62290525QRCC1CxvX4PoRwsT8hniC4b8h6304E8B7'

    // If you have a hosted payment URL from InfinityPay, you can also expose it:
    // Example (placeholder):
    // const checkoutUrl = `https://pay.infinitepay.io/seu-link?ref=${encodeURIComponent(orderId || '')}`

    return NextResponse.json({
      // Prefer hosted URL when available; else expose pixCode to render QR in-app
      // checkoutUrl,
      pixCode: infinityPayCode,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Pix checkout failed' }, { status: 500 })
  }
}



