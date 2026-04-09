const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const app = express();

app.use(cors());
app.use(express.json());

// --- OFFICIAL DARKIS CREDENTIALS ---
const siteCode = "DAR-DAR-016"; 
const privateKey = "ecf33b21e4416d332c8e706107d2aa38";
const apiKey = "3a753408ea86368f9922e1b6595f8da0";

app.post('/pay', async (req, res) => {
    try {
        const { amount, transactionReference } = req.body;

        const bankReference = "DARKIS-SHADES";
        const cancelUrl = "http://127.0.0.1:5500/backend/pages/checkout.html";
        const errorUrl = "http://127.0.0.1:5500/backend/pages/checkout.html";
        const successUrl = "http://127.0.0.1:5500/index.html";

        // THE HASH - Forced to lowercase for Ozow compliance
        const rawString = (siteCode + transactionReference + amount + bankReference + cancelUrl + errorUrl + successUrl + privateKey).toLowerCase();
        const hash = crypto.createHash('sha512').update(rawString).digest('hex');

        const postData = {
            siteCode,
            transactionReference,
            bankReference,
            amount,
            cancelUrl,
            errorUrl,
            successUrl,
            hash,
            isTest: true 
        };

        const response = await axios.post('https://pay.ozow.com/post', postData, {
            headers: { 'ApiKey': apiKey }
        });
        
        res.json({ url: response.data.url || response.request.res.responseUrl });

    } catch (error) {
        console.error("--- !!! OZOW REJECTION DETAILS !!! ---");
        if (error.response) {
            // THIS IS THE SCANNER: It prints the EXACT reason in your terminal
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Connection Error:", error.message);
        }
        res.status(500).json({ error: "Rejection from Ozow. See terminal." });
    }
});

app.listen(3000, () => console.log('DARKIS Server is LIVE on port 3000'));