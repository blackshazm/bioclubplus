import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer'; // Para tipagem do transporter
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  private transporter: Mail;

  constructor() {
    // Configuração do transporter do Nodemailer
    // Para produção, usar um serviço de email robusto (SendGrid, Mailgun, AWS SES)
    // Para desenvolvimento, pode-se usar Ethereal (gera credenciais na hora) ou Mailtrap
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: (process.env.EMAIL_SECURE === 'true'), // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Usuário do serviço de email
        pass: process.env.EMAIL_PASS, // Senha do serviço de email
      },
      // tls: {
      //   rejectUnauthorized: false // Apenas para desenvolvimento com self-signed certificates
      // }
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    if (process.env.NODE_ENV !== 'test') { // Não verificar em ambiente de teste
        try {
            await this.transporter.verify();
            console.log('Serviço de Email conectado e pronto para enviar.');
        } catch (error) {
            console.error('Erro ao conectar com o serviço de Email:', error);
            // Em um cenário de produção, você pode querer notificar ou tentar reconectar.
        }
    }
  }

  private async sendMail(mailOptions: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado: %s', info.messageId);
      // Link para preview no Ethereal, se estiver usando
      if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      return info;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Falha ao enviar e-mail.'); // Propaga o erro para ser tratado pelo chamador
    }
  }

  // --- Template Básico para E-mails ---
  private getHtmlTemplate(title: string, bodyContent: string, footerContent?: string): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - BioClub+</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background-color: #4CAF50; color: white; padding: 10px 0; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
          .header h1 { margin: 0; }
          .content { padding: 20px; }
          .content p { margin-bottom: 15px; }
          .button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #777; }
          .footer a { color: #4CAF50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>BioClub+</h1></div>
          <div class="content">
            <h2>${title}</h2>
            ${bodyContent}
          </div>
          ${footerContent ? `<div class="footer">${footerContent}</div>` : ''}
        </div>
      </body>
      </html>
    `;
  }


  // --- E-mail de Verificação ---
  public async sendVerificationEmail(to: string, name: string, verificationLink: string) {
    const subject = 'Verifique seu endereço de e-mail - BioClub+';
    const bodyContent = `
      <p>Olá ${name},</p>
      <p>Obrigado por se registrar no BioClub+! Por favor, clique no botão abaixo para verificar seu endereço de e-mail e ativar sua conta:</p>
      <p style="text-align: center;">
        <a href="${verificationLink}" class="button" target="_blank">Verificar E-mail</a>
      </p>
      <p>Se você não conseguir clicar no botão, copie e cole o seguinte link no seu navegador:</p>
      <p><a href="${verificationLink}" target="_blank">${verificationLink}</a></p>
      <p>Se você não se registrou no BioClub+, por favor, ignore este e-mail.</p>
    `;
    const footer = `<p>&copy; ${new Date().getFullYear()} BioClub+. Todos os direitos reservados.</p>`;

    const html = this.getHtmlTemplate('Verificação de E-mail', bodyContent, footer);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM || '"BioClub+" <noreply@example.com>',
      to: to,
      subject: subject,
      html: html,
      text: \`Olá ${name},

Por favor, verifique seu e-mail copiando este link: ${verificationLink}

BioClub+\` // Fallback em texto puro
    };

    return this.sendMail(mailOptions);
  }

  // --- E-mail de Redefinição de Senha ---
  public async sendPasswordResetEmail(to: string, name: string, resetLink: string) {
    const subject = 'Redefinição de Senha - BioClub+';
    const bodyContent = `
      <p>Olá ${name},</p>
      <p>Recebemos uma solicitação para redefinir sua senha na BioClub+. Se foi você, clique no botão abaixo para escolher uma nova senha:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" class="button" target="_blank">Redefinir Senha</a>
      </p>
      <p>Este link de redefinição de senha expirará em 10 minutos.</p>
      <p>Se você não conseguir clicar no botão, copie e cole o seguinte link no seu navegador:</p>
      <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
      <p>Se você não solicitou uma redefinição de senha, por favor, ignore este e-mail ou entre em contato conosco se tiver preocupações.</p>
    `;
    const footer = `<p>&copy; ${new Date().getFullYear()} BioClub+. Todos os direitos reservados.</p>`;
    const html = this.getHtmlTemplate('Redefinição de Senha', bodyContent, footer);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM || '"BioClub+" <noreply@example.com>',
      to: to,
      subject: subject,
      html: html,
      text: \`Olá ${name},

Para redefinir sua senha, use este link: ${resetLink}

BioClub+\` // Fallback
    };

    return this.sendMail(mailOptions);
  }

  // Adicionar outros métodos de email conforme necessário (ex: confirmação de pedido, etc.)
}

// Exportar uma instância única do serviço (Singleton pattern)
export default new EmailService();
