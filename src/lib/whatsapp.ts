function digitsOnly(phoneE164: string) {
    // WhatsApp Cloud API requiere el número sin "+" y solo dígitos
    return phoneE164.replace(/[^\d]/g, "");
}

export async function sendWhatsAppOtp(phoneE164: string, code: string) {
    const provider = (process.env.WHATSAPP_PROVIDER || "meta").toLowerCase();

    if (provider === "mock") {
        console.log(`[MOCK WHATSAPP OTP] to=${phoneE164} code=${code}`);
        return;
    }

    const text = `Tu código de verificación es: ${code}. Vence en 10 minutos.`;

    // --- TWILIO ---
    if (provider === "twilio") {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.WHATSAPP_FROM; // ejemplo: "whatsapp:+14155238886"

        if (!accountSid || !authToken || !from) {
            throw new Error("Faltan variables TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / WHATSAPP_FROM para Twilio.");
        }

        const to = phoneE164.startsWith("whatsapp:") ? phoneE164 : `whatsapp:${phoneE164}`;

        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

        const body = new URLSearchParams();
        body.set("From", from);
        body.set("To", to);
        body.set("Body", text);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
            cache: "no-store",
        });

        if (!res.ok) {
            const errText = await res.text().catch(() => "");
            throw new Error(`Twilio WhatsApp error (${res.status}): ${errText}`);
        }

        return;
    }

    // --- META WHATSAPP CLOUD API (DEFAULT) ---
    const token = process.env.WHATSAPP_TOKEN; // Bearer token
    const phoneNumberId = process.env.WHATSAPP_FROM; // phone_number_id (no es el número)
    const graphVersion = process.env.WHATSAPP_META_VERSION || "v20.0";

    if (!token || !phoneNumberId) {
        throw new Error("Faltan variables WHATSAPP_TOKEN / WHATSAPP_FROM (phone_number_id) para Meta Cloud API.");
    }

    const to = digitsOnly(phoneE164);

    const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;

    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: text },
    };

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Meta WhatsApp Cloud API error (${res.status}): ${errText}`);
    }

}