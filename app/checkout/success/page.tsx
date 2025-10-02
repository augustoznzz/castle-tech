'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="container pt-24 pb-24">
      <h1 className="heading-md mb-3">Payment successful</h1>
      <p className="text-body mb-6">Thank you for your purchase! A receipt has been sent to your email.</p>
      <Link href="/plans" className="btn-primary">View plans</Link>
    </div>
  )
}


