'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PixPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20"><div className="container section-padding">Carregando...</div></div>}>
      <PixContent />
    </Suspense>
  )
}

function PixContent() {
  const search = useSearchParams()
  const code = search.get('code') || ''
  const [qrUrl, setQrUrl] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    async function generateQr() {
      try {
        if (!code) {
          setQrUrl('')
          return
        }
        // Use external QR service to avoid bundling dependencies
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(code)}`
        if (!cancelled) setQrUrl(url)
      } catch {
        if (!cancelled) setQrUrl('')
      }
    }
    generateQr()
    return () => { cancelled = true }
  }, [code])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      alert('Código Pix copiado!')
    } catch {
      alert('Não foi possível copiar o código Pix')
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        <h1 className="heading-lg mb-6">Pagamento via Pix</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-border/10 p-6">
            <div className="mb-4 text-sm text-muted">Escaneie o QR ou copie o código abaixo</div>
            {qrUrl ? (
              <img src={qrUrl} alt="QR Pix" className="mx-auto w-64 h-64 object-contain" />
            ) : (
              <div className="text-sm text-muted">Gerando QR...</div>
            )}
          </div>
          <div className="rounded-lg border border-border bg-border/10 p-6 space-y-4">
            <div className="text-sm text-muted">Código Copia e Cola</div>
            <textarea
              readOnly
              value={code}
              className="w-full h-40 rounded-md bg-border/20 border border-border px-3 py-2 text-sm"
            />
            <button onClick={copy} className="btn-primary">Copiar código Pix</button>
          </div>
        </div>
      </div>
    </div>
  )
}



