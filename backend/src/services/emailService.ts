import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

if (!GMAIL_USER) throw new Error('GMAIL_USER não definido.')
if (!GMAIL_APP_PASSWORD) throw new Error('GMAIL_APP_PASSWORD não definido.')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
})

const URL_BASE = process.env.URL_BASE
if (!URL_BASE) throw new Error('URL_BASE não definido.')

export const emailService = {
  async sendPasswordReset(to: string, name: string, token: string) {
    const resetUrl = `${process.env.URL_BASE}/auth/reset-password?token=${token}` // Para emular: http://10.0.2.2:3000

    await transporter.sendMail({
      from: `"Fast Recipe" <${GMAIL_USER}>`,
      to,
      subject: 'Fast Recipe — Recuperação de senha',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #7A0000;">Recuperação de senha</h2>
          <p>Olá, <strong>${name}</strong>!</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no Fast Recipe.</p>
          <p>Clique no botão abaixo para criar uma nova senha. O link é válido por <strong>1 hora</strong>.</p>
          <a href="${resetUrl}"
            style="display: inline-block; background-color: #7A0000; color: white;
            padding: 12px 24px; border-radius: 24px; text-decoration: none;
            font-weight: bold; margin: 16px 0;">
            Redefinir senha
          </a>
          <p style="color: #9CA3AF; font-size: 13px;">
            Se você não solicitou a recuperação de senha, ignore este e-mail.
          </p>
        </div>
      `,
    })
  },
}