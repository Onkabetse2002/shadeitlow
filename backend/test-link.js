require('dotenv').config();
const crypto = require('crypto');

// This mimics a real transaction
const data = {
    amount: "550.00",
    transactionReference: "DARKIS_TEST_" + Date.now(),
    bankReference: "DARKIS_TEST"
};

const hashString = (
    process.env.SITE_CODE +
    process.env.COUNTRY_CODE +
    process.env.CURRENCY_CODE +
    data.amount +
    data.transactionReference +
    data.bankReference +
    process.env.CANCEL_URL +
    process.env.ERROR_URL +
    process.env.SUCCESS_URL +
    process.env.IS_TEST +
    process.env.PRIVATE_KEY
).toLowerCase();

const hash = crypto.createHash('sha512').update(hashString).digest('hex');

const finalUrl = `https://pay.ozow.com/pay` +
    `?SiteCode=${process.env.SITE_CODE}` +
    `&CountryCode=${process.env.COUNTRY_CODE}` +
    `&CurrencyCode=${process.env.CURRENCY_CODE}` +
    `&Amount=${data.amount}` +
    `&TransactionReference=${data.transactionReference}` +
    `&BankReference=${data.bankReference}` +
    `&CancelUrl=${encodeURIComponent(process.env.CANCEL_URL)}` +
    `&ErrorUrl=${encodeURIComponent(process.env.ERROR_URL)}` +
    `&SuccessUrl=${encodeURIComponent(process.env.SUCCESS_URL)}` +
    `&IsTest=${process.env.IS_TEST}` +
    `&Hash=${hash}`;

console.log("\n🚀 COPY AND PASTE THIS LINK INTO YOUR BROWSER:\n");
console.log(finalUrl);
console.log("\n--------------------------------------------\n");