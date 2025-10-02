'use client'

import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="container pt-24 pb-24">
      <h1 className="heading-md mb-3">Payment cancelled</h1>
      <p className="text-body mb-6">Your payment was cancelled. You can resume checkout anytime.</p>
      <Link href="/plans" className="btn-secondary">Back to plans</Link>
    </div>
  )
}


