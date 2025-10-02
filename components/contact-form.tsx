"use client"

import { useState } from 'react'

interface FormState {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [state, setState] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${state.firstName} ${state.lastName}`.trim(),
          email: state.email,
          subject: state.subject,
          message: state.message,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Failed to send')

      setSuccess('Mensagem enviada com sucesso!')
      setState({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setError(err?.message || 'Erro ao enviar a mensagem')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
            Nome
          </label>
          <input
            type="text"
            id="firstName"
            value={state.firstName}
            onChange={(e) => setState({ ...state, firstName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-border/20 border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Seu nome"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
            Sobrenome
          </label>
          <input
            type="text"
            id="lastName"
            value={state.lastName}
            onChange={(e) => setState({ ...state, lastName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-border/20 border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Seu sobrenome"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-border/20 border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Seu melhor e-mail"
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          Assunto
        </label>
        <select
          id="subject"
          value={state.subject}
          onChange={(e) => setState({ ...state, subject: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <option value="">Selecione um assunto</option>
          <option value="general">Dúvida geral</option>
          <option value="support">Suporte na compra</option>
          <option value="other">Outro</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Mensagem
        </label>
        <textarea
          id="message"
          rows={6}
          value={state.message}
          onChange={(e) => setState({ ...state, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-border/20 border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
          placeholder="Conte como podemos ajudar você..."
          required
        />
      </div>

      {success && <p className="text-green-500 text-sm">{success}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? 'Enviando...' : 'Enviar mensagem'}
      </button>
    </form>
  )
}


