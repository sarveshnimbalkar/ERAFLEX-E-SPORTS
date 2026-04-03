import nodemailer from "nodemailer";
import { hasEmailCredentials, serverEnv } from "@/lib/server/env";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NODEMAILER TRANSPORTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const smtpHost = serverEnv.emailHost;
const smtpPort = serverEnv.emailPort;
const smtpUser = serverEnv.emailUser;
const smtpPass = serverEnv.emailPass;
const smtpFrom = serverEnv.emailFrom;

const transporter = hasEmailCredentials
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WELCOME EMAIL TEMPLATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getWelcomeEmailHTML(userName: string, websiteLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Welcome to ERAFLEX</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .hero-title { font-size: 32px !important; line-height: 38px !important; }
      .hero-sub { font-size: 15px !important; }
      .feature-cell { display: block !important; width: 100% !important; padding: 12px 0 !important; }
      .cta-btn { width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#050505; font-family:'Inter',Arial,Helvetica,sans-serif;">

  <!-- Preheader text (hidden) -->
  <div style="display:none; font-size:1px; color:#050505; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    Welcome to ERAFLEX E-SPORTS — Your game starts now. Explore premium jerseys from the world's top teams.
  </div>

  <!-- OUTER WRAPPER -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#050505;">
    <tr>
      <td align="center" style="padding: 30px 10px;">

        <!-- EMAIL CONTAINER -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="580" class="email-container" style="max-width:580px; background-color:#0a0a0a; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.06);">

          <!-- ═══════════════════════════════════════════ -->
          <!-- HEADER -->
          <!-- ═══════════════════════════════════════════ -->
          <tr>
            <td style="padding:0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 28px 40px; background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);" class="mobile-padding">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td>
                          <!-- Brand Name -->
                          <span style="font-family:'Inter',Arial,sans-serif; font-size:24px; font-weight:900; color:#ffffff; letter-spacing:4px; text-transform:uppercase;">ERA<span style="color:#ff3c3c;">FLEX</span></span>
                        </td>
                        <td align="right">
                          <span style="font-family:'Inter',Arial,sans-serif; font-size:10px; font-weight:600; color:rgba(255,255,255,0.35); letter-spacing:3px; text-transform:uppercase;">E-SPORTS</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Accent bar -->
                <tr>
                  <td style="height:3px; background: linear-gradient(90deg, #ff3c3c 0%, #ff6b35 40%, #ffaa00 100%); font-size:0; line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══════════════════════════════════════════ -->
          <!-- HERO SECTION -->
          <!-- ═══════════════════════════════════════════ -->
          <tr>
            <td style="padding: 50px 40px 30px 40px; text-align:center;" class="mobile-padding">
              <!-- Status badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="background-color:rgba(255,60,60,0.12); border: 1px solid rgba(255,60,60,0.25); border-radius:50px; padding: 8px 22px;">
                    <span style="font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:700; color:#ff3c3c; letter-spacing:3px; text-transform:uppercase;">ACCOUNT ACTIVATED</span>
                  </td>
                </tr>
              </table>

              <!-- Headline -->
              <h1 class="hero-title" style="font-family:'Inter',Arial,sans-serif; font-size:42px; font-weight:900; color:#ffffff; margin:30px 0 0 0; line-height:48px; letter-spacing:-1px; text-transform:uppercase;">
                YOU'RE IN 🔥
              </h1>
              <p class="hero-sub" style="font-family:'Inter',Arial,sans-serif; font-size:17px; font-weight:400; color:rgba(255,255,255,0.5); margin:14px 0 0 0; line-height:26px;">
                Welcome to the game. Your era starts now.
              </p>
            </td>
          </tr>

          <!-- ═══════════════════════════════════════════ -->
          <!-- PERSONALIZATION CARD -->
          <!-- ═══════════════════════════════════════════ -->
          <tr>
            <td style="padding: 0 40px 30px 40px;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#111111; border-radius:14px; border:1px solid rgba(255,255,255,0.06);">
                <tr>
                  <td style="padding: 32px 30px;">
                    <!-- Avatar circle -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td width="52" valign="middle">
                          <div style="width:48px; height:48px; border-radius:50%; background: linear-gradient(135deg, #ff3c3c, #ff6b35); text-align:center; line-height:48px; font-family:'Inter',Arial,sans-serif; font-size:20px; font-weight:900; color:#ffffff;">
                            ${userName.charAt(0).toUpperCase()}
                          </div>
                        </td>
                        <td style="padding-left:16px;" valign="middle">
                          <p style="font-family:'Inter',Arial,sans-serif; font-size:18px; font-weight:700; color:#ffffff; margin:0; line-height:22px;">
                            Hey ${userName}! 👋
                          </p>
                          <p style="font-family:'Inter',Arial,sans-serif; font-size:13px; font-weight:400; color:rgba(255,255,255,0.45); margin:4px 0 0 0; line-height:18px;">
                            Your account has been successfully created
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <div style="height:1px; background-color:rgba(255,255,255,0.06); margin:24px 0;"></div>

                    <p style="font-family:'Inter',Arial,sans-serif; font-size:14px; font-weight:400; color:rgba(255,255,255,0.6); margin:0; line-height:24px;">
                      You've just joined the ultimate destination for premium sports jerseys. From iconic club kits to national team classics — we've got your game covered.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══════════════════════════════════════════ -->
          <!-- CTA BUTTON -->
          <!-- ═══════════════════════════════════════════ -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align:center;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="cta-btn">
                <tr>
                  <td style="border-radius:12px; background: linear-gradient(135deg, #ff3c3c 0%, #ff6b35 100%);">
                    <a href="${websiteLink}/shop" target="_blank" style="display:inline-block; padding:18px 48px; font-family:'Inter',Arial,sans-serif; font-size:15px; font-weight:800; color:#ffffff; text-decoration:none; letter-spacing:2px; text-transform:uppercase; border-radius:12px;">
                      EXPLORE JERSEYS →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══════════════════════════════════════════ -->
          <!-- FEATURES SECTION -->
          <!-- ═══════════════════════════════════════════ -->
          <tr>
            <td style="padding: 0 40px 40px 40px;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#111111; border-radius:14px; border:1px solid rgba(255,255,255,0.06);">
                <tr>
                  <td style="padding: 28px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <!-- Feature 1 -->
                        <td width="33%" class="feature-cell" style="text-align:center; padding:8px;">
                          <div style="font-size:28px; line-height:34px;">⚡</div>
                          <p style="font-family:'Inter',Arial,sans-serif; font-size:12px; font-weight:700; color:#ffffff; margin:10px 0 0 0; letter-spacing:1px; text-transform:uppercase;">Latest</p>
                          <p style="font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:400; color:rgba(255,255,255,0.4); margin:4px 0 0 0;">Jerseys</p>
                        </td>
                        <!-- Feature 2 -->
                        <td width="33%" class="feature-cell" style="text-align:center; padding:8px; border-left:1px solid rgba(255,255,255,0.06); border-right:1px solid rgba(255,255,255,0.06);">
                          <div style="font-size:28px; line-height:34px;">🏆</div>
                          <p style="font-family:'Inter',Arial,sans-serif; font-size:12px; font-weight:700; color:#ffffff; margin:10px 0 0 0; letter-spacing:1px; text-transform:uppercase;">Top</p>
                          <p style="font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:400; color:rgba(255,255,255,0.4); margin:4px 0 0 0;">Teams</p>
                        </td>
                        <!-- Feature 3 -->
                        <td width="33%" class="feature-cell" style="text-align:center; padding:8px;">
                          <div style="font-size:28px; line-height:34px;">🚀</div>
                          <p style="font-family:'Inter',Arial,sans-serif; font-size:12px; font-weight:700; color:#ffffff; margin:10px 0 0 0; letter-spacing:1px; text-transform:uppercase;">Fast</p>
                          <p style="font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:400; color:rgba(255,255,255,0.4); margin:4px 0 0 0;">Delivery</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══════════════════════════════════════════ -->
          <!-- DIVIDER -->
          <!-- ═══════════════════════════════════════════ -->
          <tr>
            <td style="padding: 0 40px;" class="mobile-padding">
              <div style="height:1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);"></div>
            </td>
          </tr>

          <!-- ═══════════════════════════════════════════ -->
          <!-- FOOTER -->
          <!-- ═══════════════════════════════════════════ -->
          <tr>
            <td style="padding: 32px 40px 36px 40px; text-align:center;" class="mobile-padding">
              <!-- Brand -->
              <p style="font-family:'Inter',Arial,sans-serif; font-size:16px; font-weight:900; color:rgba(255,255,255,0.25); margin:0; letter-spacing:4px; text-transform:uppercase;">
                ERA<span style="color:rgba(255,60,60,0.4);">FLEX</span>
              </p>
              <p style="font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:400; color:rgba(255,255,255,0.2); margin:12px 0 0 0; line-height:18px;">
                Premium Sports Jerseys · Worldwide Shipping
              </p>

              <!-- Social Icons Row -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-top:20px;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="#" style="display:inline-block; width:32px; height:32px; border-radius:8px; background-color:rgba(255,255,255,0.06); text-align:center; line-height:32px; font-size:14px; text-decoration:none;">📸</a>
                  </td>
                  <td style="padding:0 8px;">
                    <a href="#" style="display:inline-block; width:32px; height:32px; border-radius:8px; background-color:rgba(255,255,255,0.06); text-align:center; line-height:32px; font-size:14px; text-decoration:none;">🐦</a>
                  </td>
                  <td style="padding:0 8px;">
                    <a href="#" style="display:inline-block; width:32px; height:32px; border-radius:8px; background-color:rgba(255,255,255,0.06); text-align:center; line-height:32px; font-size:14px; text-decoration:none;">💬</a>
                  </td>
                </tr>
              </table>

              <!-- Support -->
              <p style="font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:400; color:rgba(255,255,255,0.18); margin:20px 0 0 0; line-height:18px;">
                Need help? Contact us at
                <a href="mailto:swordsman848@gmail.com" style="color:rgba(255,60,60,0.5); text-decoration:none;">swordsman848@gmail.com</a>
              </p>
              <p style="font-family:'Inter',Arial,sans-serif; font-size:10px; font-weight:400; color:rgba(255,255,255,0.1); margin:16px 0 0 0;">
                © ${new Date().getFullYear()} ERAFLEX E-SPORTS. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- END EMAIL CONTAINER -->

      </td>
    </tr>
  </table>
  <!-- END OUTER WRAPPER -->

</body>
</html>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEND WELCOME EMAIL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function sendWelcomeEmail(
  userName: string,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!transporter) {
      return {
        success: false,
        error:
          "Email is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, and optionally EMAIL_FROM in .env.local.",
      };
    }

    const websiteLink = serverEnv.websiteUrl;
    const fromAddress = smtpFrom || `ERAFLEX E-SPORTS <${smtpUser}>`;

    const mailOptions = {
      from: fromAddress,
      to: userEmail,
      subject: "Welcome to ERAFLEX 🔥 You're In!",
      html: getWelcomeEmailHTML(userName, websiteLink),
    };

    await transporter.verify();
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error(`❌ Failed to send welcome email to ${userEmail}:`, message);
    return { success: false, error: message };
  }
}
