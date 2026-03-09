import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPremiumWelcomeParams {
  to: string;
  name: string;
  plan: "monthly" | "yearly";
  expiryDate: Date;
}

export async function sendPremiumWelcomeEmail({
  to,
  name,
  plan,
  expiryDate,
}: SendPremiumWelcomeParams) {
  const planLabel =
    plan === "yearly" ? "Tahunan (Rp 799.000)" : "Bulanan (Rp 99.000)";
  const expiryLabel = expiryDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin:0;padding:0;background:#0f0f13;font-family:'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f13;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="520" cellpadding="0" cellspacing="0" style="background:#18181f;border-radius:16px;overflow:hidden;border:1px solid #2a2a35;">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#6c47ff,#4f8dff);padding:36px 40px;text-align:center;">
                  <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">🎉 Selamat, Kamu Sudah Premium!</h1>
                  <p style="margin:10px 0 0;color:rgba(255,255,255,0.80);font-size:15px;">Akses penuh ke semua kursus premium sudah aktif.</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 24px;color:#c8c8d8;font-size:15px;">Halo <strong style="color:#fff;">${name}</strong>,</p>
                  <p style="margin:0 0 24px;color:#c8c8d8;font-size:15px;line-height:1.6;">
                    Pembayaranmu berhasil diproses! Sekarang kamu punya akses tak terbatas ke seluruh kursus premium di <strong style="color:#fff;">Lumina</strong>.
                  </p>

                  <!-- Detail Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f13;border-radius:12px;border:1px solid #2a2a35;margin-bottom:28px;">
                    <tr>
                      <td style="padding:20px 24px;">
                        <table width="100%" cellpadding="6" cellspacing="0">
                          <tr>
                            <td style="color:#7b7b9d;font-size:13px;">Paket</td>
                            <td align="right" style="color:#fff;font-size:13px;font-weight:600;">${planLabel}</td>
                          </tr>
                          <tr>
                            <td style="color:#7b7b9d;font-size:13px;">Status</td>
                            <td align="right"><span style="background:#16a34a22;color:#4ade80;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;border:1px solid #4ade8055;">AKTIF</span></td>
                          </tr>
                          <tr>
                            <td style="color:#7b7b9d;font-size:13px;">Aktif hingga</td>
                            <td align="right" style="color:#fff;font-size:13px;font-weight:600;">${expiryLabel}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA -->
                  <p style="text-align:center;margin:0 0 28px;">
                    <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6c47ff,#4f8dff);color:#fff;font-size:14px;font-weight:700;padding:13px 32px;border-radius:10px;text-decoration:none;">
                      Mulai Belajar Sekarang →
                    </a>
                  </p>

                  <p style="color:#7b7b9d;font-size:13px;text-align:center;line-height:1.6;margin:0;">
                    Punya pertanyaan? Balas email ini atau hubungi support kami.<br/>
                    🔒 Garansi uang kembali 7 hari — tidak puas, refund tanpa syarat.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#0f0f13;border-top:1px solid #2a2a35;padding:20px 40px;text-align:center;">
                  <p style="margin:0;color:#7b7b9d;font-size:12px;">
                    © ${new Date().getFullYear()} Lumina · Kamu menerima email ini karena baru saja melakukan pembayaran.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: process.env.FROM_EMAIL ?? "noreply@resend.dev",
    to,
    subject: "🎉 Pembayaran Berhasil — Akun Premium Kamu Sudah Aktif!",
    html,
  });
}
