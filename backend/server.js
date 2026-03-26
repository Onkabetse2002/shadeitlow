require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const crypto = require('crypto'); // Node.js built-in SHA512

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(helmet()); // Security headers
app.use(cors()); // Frontend access
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // Form data
app.use(morgan('combined')); // Request logging

// ==================== TEST ENDPOINT ====================
app.get('/test', (req, res) => {
  res.json({ 
    message: '🚀 DARKIS Backend + Ozow READY',
    ozowUrl: 'https://pay.ozow.com/PaymentGateway/Index',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// ==================== OZOW PAYMENT ENDPOINT ====================
app.post('/pay', (req, res) => {
  try {
    // 1. Extract request data
    const { 
      amount, 
      email, 
      transactionReference = `DARKIS_${Date.now()}`
    } = req.body;
    
    // 2. Validate input
    if (!amount) {
      return res.status(400).json({ 
        error: 'Amount is required',
        received: req.body 
      });
    }
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required',
        received: req.body 
      });
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ 
        error: 'Amount must be positive number',
        received: { amount, email }
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        received: { amount, email }
      });
    }
    
    // 3. Ozow environment variables
    const siteCode = process.env.SITE_CODE;
    const privateKey = process.env.PRIVATE_KEY;
    
    if (!siteCode || !privateKey) {
      console.error('❌ Ozow SITE_CODE or PRIVATE_KEY missing in .env');
      return res.status(500).json({ 
        error: 'Payment gateway configuration error' 
      });
    }
    
    // 4. Ozow URLs from .env
    const cancelUrl = process.env.CANCEL_URL || 'http://localhost/pages/ozow.html';
    const successUrl = process.env.SUCCESS_URL || 'http://localhost/pages/ozow.html';
    const notifyUrl = process.env.NOTIFY_URL || 'http://localhost/notify';
    
    // 5. Convert amount to cents (Ozow requirement)
    const amountInCents = Math.round(parsedAmount * 100);
    
    // 6. Generate Ozow SHA512 Hash (EXACT FORMAT)
    // Format: siteCode + amountInCents + transactionReference + successUrl + cancelUrl + privateKey
    const hashString = `${siteCode}${amountInCents}${transactionReference}${successUrl}${cancelUrl}${privateKey}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    // 7. Log for debugging
    console.log(`\n💳 OZOW PAYMENT REQUEST:`);
    console.log(`   Amount: R${parsedAmount} (${amountInCents} cents)`);
    console.log(`   Email: ${email}`);
    console.log(`   Ref: ${transactionReference}`);
    console.log(`   Hash: ${hash.substring(0, 32)}...`);
    
    // 8. ✅ FIXED OZOW URL: pay.ozow.com (NOT www.ozow.com)
    const ozowPaymentUrl = `https://pay.ozow.com/PaymentGateway/Index?` +
      new URLSearchParams({
        siteCode: siteCode,
        amountInCents: amountInCents,
        transactionReference: transactionReference,
        cancelUrl: cancelUrl,
        successUrl: successUrl,
        notifyUrl: notifyUrl,
        hash: hash,
        customerEmail: email,
        countryCode: 'ZA',
        currencyCode: 'ZAR',
        isTest: process.env.IS_TEST === 'true' ? 'true' : 'false'
      }).toString();
    
    // 9. Send payment URL to frontend
    res.status(200).json({
      success: true,
      message: '✅ Ozow payment URL generated successfully',
      data: {
        paymentUrl: ozowPaymentUrl,
        amount: parsedAmount,
        amountInCents: amountInCents,
        currency: 'ZAR',
        transactionReference: transactionReference,
        email: email.toLowerCase(),
        hashPreview: hash.substring(0, 32) + '...',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('💥 Ozow Payment Error:', error);
    res.status(500).json({ 
      error: 'Payment URL generation failed',
      details: error.message 
    });
  }
});

// ==================== OZOW WEBHOOK ====================
app.post('/notify', (req, res) => {
  console.log('\n🔔 === OZOW NOTIFICATION ===');
  console.log('Status:', req.body.Status);
  console.log('TransactionRef:', req.body.TransactionReference);
  console.log('Amount:', req.body.Amount);
  console.log('Full body:', req.body);
  
  // TODO: Update order status in your database
  // Verify payment, send confirmation email, etc.
  
  res.status(200).json({ 
    status: 'OK',
    message: 'Notification received' 
  });
});

// ==================== SUCCESS/CANCEL ENDPOINTS ====================
app.get('/success', (req, res) => {
  console.log('✅ Ozow Success:', req.query);
  res.json({ 
    status: 'success',
    query: req.query,
    message: 'Payment completed successfully' 
  });
});

app.get('/cancel', (req, res) => {
  console.log('❌ Ozow Cancel:', req.query);
  res.json({ 
    status: 'cancelled',
    query: req.query,
    message: 'Payment cancelled' 
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n🚀 DARKIS Backend + Ozow running on http://localhost:${PORT}`);
  console.log(`📱 Test:          http://localhost:${PORT}/test`);
  console.log(`💳 Payments:     POST http://localhost:${PORT}/pay`);
  console.log(`🔔 Webhook:      POST http://localhost:${PORT}/notify`);
  console.log(`✅ Ozow URL:     https://pay.ozow.com/PaymentGateway/Index`);
  console.log(`\n📝 .env vars needed: SITE_CODE, PRIVATE_KEY, SUCCESS_URL\n`);
});