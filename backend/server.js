const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();

app.use(cors());
app.use(express.json());

// Load from .env or use defaults
const PF_ID = "34524679";
const PF_KEY = "1tbfpjuomlb06";
const PF_PASS = "DARKIS_secure_2026";

app.post('/generate-signature', (req, res) => {
    try {
        const { amount, item_name, name_first, email_address } = req.body;
        
        // PayFast requires exactly 2 decimal places
        const formattedAmount = parseFloat(amount).toFixed(2);

        const data = {
            merchant_id: PF_ID,
            merchant_key: PF_KEY,
            return_url: "https://darkis.co.za/success.html",
            cancel_url: "https://darkis.co.za/cancel.html",
            name_first: name_first,
            email_address: email_address,
            amount: formattedAmount,
            item_name: item_name
        };

        // Create signature string
        let pfOutput = "";
        for (let key in data) {
            pfOutput += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}&`;
        }
        
        const finalString = pfOutput + `passphrase=${PF_PASS}`;
        const signature = crypto.createHash('md5').update(finalString).digest('hex');

        res.json({ ...data, signature });
        console.log("✅ Signature Generated for R" + formattedAmount);

    } catch (err) {
        console.error("❌ Server Error:", err.message);
        res.status(500).send("Server Error");
    }
});

app.listen(3000, () => console.log('🚀 DARKIS Server running on http://localhost:3000'));