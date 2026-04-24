/**
 * SMS Parser - Test Examples & Usage Guide
 * Run this file to test the SMS parser functionality
 */

// This file contains examples of how to use the SMS parser

// ============================================
// EXAMPLE 1: Basic SMS Parsing
// ============================================

const SMSParser = require('./services/smsParser');

console.log('=== EXAMPLE 1: Basic SMS Parsing ===\n');

// OTP SMS
const otpSMS = "Your OTP is 654321. Valid for 10 minutes.";
const otpResult = SMSParser.parseSMS(otpSMS);
console.log('OTP SMS Parse Result:', otpResult);
// Expected output: { messageType: 'OTP', extractedInfo: { otp: '654321' }, confidence: 0.95 }

// Transaction SMS
const transactionSMS = "Your bank account debited by ₹5000 for transaction ref: TXN123456. Status: successful";
const txnResult = SMSParser.parseSMS(transactionSMS);
console.log('\nTransaction SMS Parse Result:', txnResult);
// Expected output: { messageType: 'TRANSACTION', extractedInfo: { amount: '5000', status: 'successful' }, ... }

// Service notification
const serviceSMS = "Hello from Amazon! Your order #ORD-789456 has been shipped. Tracking: AM987654";
const svcResult = SMSParser.parseSMS(serviceSMS);
console.log('\nService SMS Parse Result:', svcResult);
// Expected output: { messageType: 'SERVICE', extractedInfo: { serviceProvider: 'ECOMMERCE' }, ... }

// ============================================
// EXAMPLE 2: SMS Validation
// ============================================

const SMSValidator = require('./utils/smsValidator');

console.log('\n=== EXAMPLE 2: SMS Validation ===\n');

// Valid phone number
console.log('Valid phone +1-555-123-4567:', SMSValidator.isValidPhoneNumber('+1-555-123-4567')); // true
console.log('Invalid phone 12345:', SMSValidator.isValidPhoneNumber('12345')); // false

// Valid content
console.log('Valid content:', SMSValidator.isValidSMSContent('Hello, this is a test SMS')); // true
console.log('Empty content:', SMSValidator.isValidSMSContent('')); // false

// Spam detection
const spamText = "CONGRATULATIONS! You won $1 million! Click here to claim now!";
console.log('Spam detection:', SMSValidator.isLikelySpam(spamText, 'UNKNOWN_SENDER')); // true

// ============================================
// EXAMPLE 3: Batch Processing
// ============================================

const SMSProcessor = require('./services/smsProcessor');

console.log('\n=== EXAMPLE 3: Batch Processing ===\n');

async function exampleBatchProcessing() {
  const smsList = [
    {
      phoneNumber: '+1-555-123-4567',
      sender: 'ICICI_BANK',
      rawContent: 'Your OTP is 123456. Valid for 5 minutes.'
    },
    {
      phoneNumber: '+1-555-234-5678',
      sender: 'AMAZON_IN',
      rawContent: 'Order confirmed for ₹2500. Delivery expected on 25 Apr.'
    },
    {
      phoneNumber: '+1-555-345-6789',
      sender: 'AIRTEL',
      rawContent: 'Your monthly bill of ₹599 has been generated.'
    }
  ];

  try {
    const result = await SMSProcessor.processBatch(smsList);
    console.log('Batch Processing Result:', JSON.stringify(result, null, 2));
    // Output: { total: 3, successful: 3, failed: 0, duplicates: 0, results: [...] }
  } catch (error) {
    console.error('Batch processing error:', error.message);
  }
}

// ============================================
// EXAMPLE 4: Single SMS Processing with Storage
// ============================================

console.log('\n=== EXAMPLE 4: Single SMS Processing ===\n');

async function exampleSingleSMSProcessing() {
  try {
    const result = await SMSProcessor.processSMS({
      phoneNumber: '+1-555-123-4567',
      sender: 'HDFC_BANK',
      rawContent: 'Your account has been credited with ₹10000. Ref: HDFC20240424001',
      user: null // Optional user ID
    });

    console.log('SMS Processing Result:', JSON.stringify(result, null, 2));
    // Output: {
    //   status: 'SUCCESS',
    //   smsId: '....',
    //   messageType: 'TRANSACTION',
    //   confidence: 0.85,
    //   processingTime: 145
    // }
  } catch (error) {
    console.error('SMS processing error:', error.message);
  }
}

// ============================================
// EXAMPLE 5: Statistics Generation
// ============================================

console.log('\n=== EXAMPLE 5: Statistics Generation ===\n');

async function exampleStatistics() {
  try {
    // Get stats for last 24 hours
    const stats24h = await SMSProcessor.getStatistics(24);
    console.log('24-Hour Statistics:', JSON.stringify(stats24h, null, 2));
    // Output: {
    //   timeRange: '24h',
    //   totalSMS: 450,
    //   byMessageType: { OTP: 120, TRANSACTION: 85, ... },
    //   byProcessingStatus: { SUCCESS: 445, FAILED: 5 },
    //   spamCount: 12,
    //   averageConfidence: 0.87
    // }

    // Get stats for last 7 days
    const stats7d = await SMSProcessor.getStatistics(24 * 7);
    console.log('7-Day Statistics:', stats7d);
  } catch (error) {
    console.error('Statistics error:', error.message);
  }
}

// ============================================
// EXAMPLE 6: Retry Failed SMS
// ============================================

console.log('\n=== EXAMPLE 6: Retry Failed SMS ===\n');

async function exampleRetryFailed() {
  try {
    const result = await SMSProcessor.retryFailedSMS(10);
    console.log('Retry Result:', JSON.stringify(result, null, 2));
    // Output: {
    //   retried: 5,
    //   results: [...]
    // }
  } catch (error) {
    console.error('Retry error:', error.message);
  }
}

// ============================================
// EXAMPLE 7: Cleanup Old Records
// ============================================

console.log('\n=== EXAMPLE 7: Cleanup Old Records ===\n');

async function exampleCleanup() {
  try {
    // Clean SMS older than 30 days
    const result = await SMSProcessor.cleanupOldRecords(30);
    console.log('Cleanup Result:', JSON.stringify(result, null, 2));
    // Output: { deletedCount: 1250, deletedReferrals: 0 }
  } catch (error) {
    console.error('Cleanup error:', error.message);
  }
}

// ============================================
// EXAMPLE 8: API Integration Example
// ============================================

console.log('\n=== EXAMPLE 8: API Integration (cURL) ===\n');

const apiExamples = `
# Process single SMS
curl -X POST http://localhost:5000/api/v1/sms/process \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "sender": "BANK123",
    "content": "Your OTP is 123456. Valid for 5 minutes."
  }'

# Process batch SMS
curl -X POST http://localhost:5000/api/v1/sms/batch \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "smsList": [
      {"phoneNumber": "+1-555-123-4567", "sender": "BANK", "content": "OTP: 123456"},
      {"phoneNumber": "+1-555-234-5678", "sender": "AMAZON", "content": "Order confirmed"}
    ]
  }'

# List SMS messages
curl http://localhost:5000/api/v1/sms/list?page=1&limit=20&type=OTP \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get SMS statistics
curl http://localhost:5000/api/v1/sms/statistics/summary?timeRange=24 \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Manually retry failed SMS
curl -X POST http://localhost:5000/api/v1/sms/retry-failed \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check worker health
curl http://localhost:5000/api/v1/sms/health/status \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

console.log(apiExamples);

// ============================================
// EXAMPLE 9: Real-World Scenarios
// ============================================

console.log('\n=== EXAMPLE 9: Real-World SMS Examples ===\n');

const realWorldExamples = [
  {
    name: 'Bank OTP',
    sms: 'ICICI: Your OTP is 847392 for login. Do not share this OTP with anyone. - ICICI Bank'
  },
  {
    name: 'Transaction Debit',
    sms: 'HDFC: Amount Rs.5000/- has been debited from AC ending with 1234. Bal: Rs. 25000/-. TxnRef#789456'
  },
  {
    name: 'E-commerce Order',
    sms: 'Amazon: Order#ORD-2024-789456 confirmed for Rs.3499. Delivery expected on 25-Apr-2024. Ref: AMZ123'
  },
  {
    name: 'Telecom Bill',
    sms: 'Jio: Your postpaid bill of Rs.599 is due on 30-Apr-2024. Visit jio.com to pay. Pay now to get 5% discount.'
  },
  {
    name: 'Payment Gateway',
    sms: 'PayTM: Payment successful. Amount: Rs.2000. TransactionID: PTM789456. Ref: TXN-456789'
  }
];

realWorldExamples.forEach(example => {
  console.log(`\n📱 ${example.name}`);
  console.log(`Raw: "${example.sms}"`);
  const parsed = SMSParser.parseSMS(example.sms);
  console.log(`Parsed:`, JSON.stringify(parsed, null, 2));
});

// ============================================
// Run Examples (Uncomment to execute)
// ============================================

/*
// Uncomment these to run async examples:
(async () => {
  await exampleBatchProcessing();
  await exampleSingleSMSProcessing();
  await exampleStatistics();
  await exampleRetryFailed();
  await exampleCleanup();
})();
*/

console.log('\n✅ SMS Parser Examples Complete!');
console.log('For more details, see SMS_PARSER_DOCUMENTATION.md');
