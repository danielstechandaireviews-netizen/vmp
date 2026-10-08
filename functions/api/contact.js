// Cloudflare Pages Function: POST /api/contact
// Emails contact-form leads, chat-assistant leads and partner sign-ups to the
// site owner through Resend. Configure in Cloudflare (Settings → Variables and
// Secrets): RESEND_API_KEY (secret), CONTACT_TO_EMAIL, and optionally FROM_EMAIL.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM = "ViralMoniPoint <onboarding@resend.dev>";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// Referral and partner codes: letters and digits only, upper-cased.
function cleanCode(code) {
  return String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
}

export function buildEmail(data) {
  const { name, email, phone, package: pkg, message } = data;
  const referral = cleanCode(data.referral);
  const isPartner = data.type === "partner";
  const partnerCode = isPartner ? cleanCode(data.partnerCode) : "";
  const body = escapeHtml(message || "").replace(/\n/g, "<br>");

  if (isPartner) {
    return {
      subject: `New partner sign-up: ${name} (${partnerCode})`,
      html: `
        <h2>New ViralMoniPoint partner sign-up</h2>
        <p><strong>Partner code:</strong> ${escapeHtml(partnerCode)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>WhatsApp:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Details:</strong></p>
        <p>${body}</p>
        <p style="color:#5c5c63">Add this code to your partner sheet so referrals can be matched to it.</p>
      `,
    };
  }
  return {
    subject: `New lead: ${name}${pkg ? ` — ${pkg}` : ""}${referral ? ` [Ref: ${referral}]` : ""}`,
    html: `
      <h2>New ViralMoniPoint lead</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
      <p><strong>Package:</strong> ${escapeHtml(pkg || "Not sure yet")}</p>
      <p><strong>Referral code:</strong> ${escapeHtml(referral || "None")}</p>
      <p><strong>Message:</strong></p>
      <p>${body}</p>
    `,
  };
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }
  data = data && typeof data === "object" ? data : {};

  if (!data.name || !data.email || !EMAIL_RE.test(data.email)) {
    return json(400, { error: "A valid name and email are required." });
  }
  if (data.type === "partner" && !cleanCode(data.partnerCode)) {
    return json(400, { error: "Missing partner code." });
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    console.error("RESEND_API_KEY or CONTACT_TO_EMAIL is not set.");
    return json(500, { error: "Email is not configured yet. Please try again later." });
  }

  const { subject, html } = buildEmail(data);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.FROM_EMAIL || DEFAULT_FROM,
        to: env.CONTACT_TO_EMAIL,
        reply_to: data.email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend send failed:", res.status, await res.text());
      return json(502, { error: "Failed to send email." });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error("Resend request failed:", err);
    return json(502, { error: "Failed to send email." });
  }
}

// Anything other than POST gets a clear error instead of a 404 page.
export function onRequest() {
  return json(405, { error: "Method not allowed." });
}
