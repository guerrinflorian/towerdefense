const DEFAULT_FROM_EMAIL = process.env.MAIL_FROM;
const DEFAULT_FROM_NAME = "Last Outpost";

let transporterPromise = null;

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = import("nodemailer").then((module) =>
      module.default.createTransport({
        host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
        port: Number(process.env.BREVO_SMTP_PORT || 587),
        secure: false,
        auth: {
          user: process.env.BREVO_SMTP_USER,
          pass: process.env.BREVO_SMTP_KEY,
        },
      })
    );
  }
  return transporterPromise;
}

function getFromEmail() {
  const mailFrom = process.env.MAIL_FROM;
  if (mailFrom) {
    // Support format: "Name" <email@domain.com> ou email@domain.com
    const match = mailFrom.match(/^"?([^"<]+)"?\s*<(.+)>$/);
    if (match) {
      return { email: match[2].trim(), name: match[1].trim() };
    }
    return { email: mailFrom.trim(), name: DEFAULT_FROM_NAME };
  }
  return { email: DEFAULT_FROM_EMAIL, name: DEFAULT_FROM_NAME };
}

export async function sendResetPasswordEmail({ to, resetLink, username }) {
  const smtpUser = process.env.BREVO_SMTP_USER;
  const smtpKey = process.env.BREVO_SMTP_KEY;

  if (!smtpUser || !smtpKey) {
    throw new Error("Configuration Brevo SMTP manquante (BREVO_SMTP_USER ou BREVO_SMTP_KEY)");
  }

  const from = getFromEmail();
  const transporter = await getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; background: #0b0f1a; color: #e6f1ff; padding: 24px;">
      <div style="max-width: 560px; margin: 0 auto; background: #101626; border: 1px solid rgba(100, 200, 255, 0.2); border-radius: 12px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.35);">
        <div style="background: linear-gradient(135deg, #007bff, #00c6ff); color: #fff; padding: 16px 20px; font-weight: bold; letter-spacing: 0.5px;">
          Réinitialisation du mot de passe - Last Outpost
        </div>
        <div style="padding: 22px;">
          <p>Bonjour ${username || "survivant"},</p>
          <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte Last Outpost.</p>
          <p style="margin: 12px 0; padding: 14px; background: rgba(0, 198, 255, 0.08); border: 1px solid rgba(0, 198, 255, 0.25); border-radius: 10px;">
            Si un nouvel email est envoyé, ce lien deviendra invalide. Il est valable pendant <strong>1 heure</strong> à partir de sa réception.
          </p>
          <p style="text-align: center;">
            <a href="${resetLink}" style="display: inline-block; padding: 14px 18px; background: linear-gradient(135deg, #007bff, #00c6ff); color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; box-shadow: 0 10px 25px rgba(0, 123, 255, 0.4);">
              Réinitialiser mon mot de passe
            </a>
          </p>
          <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
          <p style="margin-top: 22px; font-size: 12px; color: #9db4d4;">Pour des raisons de sécurité, n'hésitez pas à nous contacter si vous recevez plusieurs demandes inattendues.</p>
        </div>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"${from.name}" <${from.email}>`,
    to,
    subject: "Réinitialisation du mot de passe - Last Outpost",
    html,
    text: `Bonjour ${username || "survivant"},\n\nUne demande de réinitialisation de mot de passe a été effectuée pour votre compte Last Outpost.\n\nCliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}\n\nCe lien est valable pendant 1 heure.\n\nSi vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.`,
  });
}
