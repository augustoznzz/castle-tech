import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface ProductKey {
  productTitle: string
  key: string
}

interface EmailData {
  customerEmail: string
  customerName?: string
  orderId: string
  total: number
  currency: string
  productKeys: ProductKey[]
}

interface ContactEmailData {
  fromEmail: string
  fromName?: string
  subject?: string
  message: string
}

// Create reusable transporter
function createTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  }

  return nodemailer.createTransport(config)
}

// Generate HTML email template
function generateEmailTemplate(data: EmailData): string {
  const keysList = data.productKeys.map(key => `
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #22D3EE;">
      <h3 style="margin: 0 0 10px 0; color: #333;">${key.productTitle}</h3>
      <div style="background-color: #fff; padding: 10px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #22D3EE;">
        ${key.key}
      </div>
    </div>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chaves dos Produtos - CastleTech</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #22D3EE 0%, #1e40af 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">CastleTech</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Sua compra foi realizada com sucesso!</p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Detalhes da Compra</h2>
        <p><strong>Número do Pedido:</strong> ${data.orderId}</p>
        <p><strong>Total Pago:</strong> ${data.currency.toUpperCase()} ${data.total.toFixed(2)}</p>
        ${data.customerName ? `<p><strong>Cliente:</strong> ${data.customerName}</p>` : ''}
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; margin-bottom: 20px;">Suas Chaves de Produto</h2>
        ${keysList}
      </div>

      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3; margin-bottom: 20px;">
        <h3 style="color: #1976d2; margin-top: 0;">📋 Instruções Importantes</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Guarde estas chaves em local seguro</li>
          <li>Cada chave é única e pode ser usada apenas uma vez</li>
          <li>Em caso de problemas, entre em contato conosco</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px; margin: 0;">
          Obrigado por escolher CastleTech!<br>
          Se você tiver alguma dúvida, não hesite em nos contatar.
        </p>
      </div>
    </body>
    </html>
  `
}

// Send product keys email
export async function sendProductKeysEmail(data: EmailData): Promise<boolean> {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"CastleTech" <castletechzzz@gmail.com>`,
      to: data.customerEmail,
      subject: `Suas Chaves de Produto - Pedido ${data.orderId}`,
      html: generateEmailTemplate(data),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// Send contact form email to support inbox
export async function sendContactEmail(data: ContactEmailData): Promise<boolean> {
  try {
    const transporter = createTransporter()

    const toAddress = 'castletechzzz@gmail.com'
    const subject = data.subject?.trim() ? data.subject.trim() : 'New contact message'
    const fromName = data.fromName?.trim() ? data.fromName.trim() : 'Website Visitor'

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Contact Message</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 640px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-top:0;">New Contact Message</h2>
        <p><strong>From:</strong> ${fromName} &lt;${data.fromEmail}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="margin-top:16px; padding:12px; background:#f8f9fa; border-radius:8px; white-space:pre-wrap;">${escapeHtml(
          data.message,
        )}</div>
      </body>
      </html>
    `

    const text = `New contact message\nFrom: ${fromName} <${data.fromEmail}>\nSubject: ${subject}\n\n${data.message}`

    const info = await transporter.sendMail({
      from: `CastleTech Contact <${process.env.SMTP_USER || 'castletechzzz@gmail.com'}>`,
      to: toAddress,
      replyTo: `${fromName} <${data.fromEmail}>`,
      subject: `[Contact] ${subject}`,
      text,
      html,
    })
    console.log('Contact email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending contact email:', error)
    return false
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Test email configuration
export async function testEmailConfig(): Promise<boolean> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email configuration is valid')
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}
