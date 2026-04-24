# SMS Parser System Documentation

## Overview

The SMS Parser is a production-grade background service system for processing, parsing, and storing SMS messages. It automatically extracts structured data from SMS content, categorizes messages, and detects spam with high accuracy.

## Architecture

### Components

```
SMS Parser System
├── Models
│   └── SMS.js                 # MongoDB schema for SMS storage
├── Services
│   ├── smsParser.js          # Core parsing engine
│   └── smsProcessor.js       # Processing and orchestration
├── Utils
│   └── smsValidator.js       # Validation and sanitization
├── Workers
│   └── smsWorker.js          # Background job scheduler
├── Routes
│   └── smsRoutes.js          # API endpoints
├── Controllers
│   └── smsController.js      # Request handlers
└── Middleware
    └── inputValidation.js    # SMS input validation
```

## Features

### 1. **Message Classification**
- **OTP**: One-Time Password messages
- **TRANSACTION**: Financial transactions, payments
- **NOTIFICATION**: Service notifications, alerts
- **PROMOTIONAL**: Marketing messages
- **SERVICE**: Service provider messages
- **UNKNOWN**: Unclassified messages

### 2. **Data Extraction**
- OTP codes (4-6 digits)
- Transaction amounts and status
- Transaction IDs and references
- Timestamps
- Service provider identification
- Keywords extraction

### 3. **Spam Detection**
- Keyword-based detection
- Sender validation
- Suspicious pattern identification
- Confidence scoring

### 4. **Background Processing**
- Automatic retry of failed SMS (5-minute intervals)
- Statistics generation (hourly)
- Old record cleanup (daily)
- Duplicate detection

### 5. **Performance & Reliability**
- Batch processing support (up to 1000 SMS per batch)
- Error handling with retry logic (up to 3 attempts)
- Comprehensive logging
- Index optimization for fast queries

## API Endpoints

### 1. Process Single SMS
```
POST /api/v1/sms/process
Content-Type: application/json
Authorization: Bearer <token>

{
  "phoneNumber": "+1-555-123-4567",
  "sender": "BANK123",
  "content": "Your OTP is 123456. Valid for 5 minutes."
}

Response:
{
  "success": true,
  "message": "SMS processed successfully",
  "data": {
    "status": "SUCCESS",
    "smsId": "507f1f77bcf86cd799439011",
    "messageType": "OTP",
    "confidence": 0.95,
    "processingTime": 145
  }
}
```

### 2. Process Batch SMS
```
POST /api/v1/sms/batch
Content-Type: application/json
Authorization: Bearer <token>

{
  "smsList": [
    {
      "phoneNumber": "+1-555-123-4567",
      "sender": "BANK123",
      "content": "Your OTP is 123456"
    },
    {
      "phoneNumber": "+1-555-234-5678",
      "sender": "AMAZON",
      "content": "Order confirmed for ₹5000"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Batch processing completed",
  "data": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "duplicates": 0,
    "results": [...]
  }
}
```

### 3. List SMS Messages
```
GET /api/v1/sms/list?page=1&limit=20&type=OTP&status=SUCCESS
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "SMS retrieved successfully",
  "data": {
    "sms": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### 4. Get SMS Details
```
GET /api/v1/sms/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "SMS details retrieved",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "phoneNumber": "+1-555-123-4567",
    "sender": "BANK123",
    "rawContent": "Your OTP is 123456. Valid for 5 minutes.",
    "parsedData": {
      "messageType": "OTP",
      "extractedInfo": {
        "otp": "123456",
        "confidence": 0.95
      },
      "confidence": 0.95
    },
    "isSpam": false,
    "processingStatus": "SUCCESS",
    "createdAt": "2024-04-24T10:30:00Z"
  }
}
```

### 5. Get Statistics
```
GET /api/v1/sms/statistics/summary?timeRange=24
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "timeRange": "24h",
    "totalSMS": 450,
    "byMessageType": {
      "OTP": 120,
      "TRANSACTION": 85,
      "NOTIFICATION": 150,
      "PROMOTIONAL": 50,
      "SERVICE": 45,
      "UNKNOWN": 0
    },
    "byProcessingStatus": {
      "SUCCESS": 445,
      "FAILED": 5,
      "PENDING": 0
    },
    "spamCount": 12,
    "averageConfidence": 0.87
  }
}
```

### 6. Retry Failed SMS
```
POST /api/v1/sms/retry-failed
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Retry operation completed",
  "data": {
    "retried": 5,
    "results": [...]
  }
}
```

### 7. Cleanup Old Records
```
DELETE /api/v1/sms/cleanup?daysOld=30
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Cleanup completed: 1250 records deleted",
  "data": {
    "deletedCount": 1250
  }
}
```

### 8. Worker Health Status
```
GET /api/v1/sms/health/status
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Worker status retrieved",
  "data": {
    "isRunning": true,
    "workers": [
      "retryWorker",
      "statsWorker",
      "cleanupWorker"
    ],
    "timestamp": "2024-04-24T10:30:00Z"
  }
}
```

## Database Schema

### SMS Collection

```javascript
{
  // Identification
  _id: ObjectId,
  phoneNumber: String,      // Phone number with validation
  sender: String,           // Sender ID/Name
  receivedAt: Date,         // Timestamp of reception

  // Content
  rawContent: String,       // Original SMS text

  // Parsing Results
  parsedData: {
    messageType: String,    // OTP, TRANSACTION, etc.
    extractedInfo: {
      otp: String,
      transactionId: String,
      amount: String,
      timestamp: String,
      status: String,
      serviceProvider: String,
      keywords: [String]
    },
    confidence: Number       // 0-1 confidence score
  },

  // Processing Status
  processingStatus: String,  // PENDING, PROCESSING, SUCCESS, FAILED
  processingAttempts: Number,
  lastError: {
    code: String,
    message: String,
    timestamp: Date
  },

  // User Association
  user: ObjectId,           // Reference to User

  // Metadata
  tags: [String],
  isSpam: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Examples

### Node.js/Express Integration

```javascript
// Process single SMS
const SMSProcessor = require('./services/smsProcessor');

const result = await SMSProcessor.processSMS({
  phoneNumber: '+1-555-123-4567',
  sender: 'BANK123',
  rawContent: 'Your OTP is 654321. Valid for 10 minutes.',
  user: userId
});

console.log(result);
// Output:
// {
//   status: 'SUCCESS',
//   smsId: '507f1f77bcf86cd799439011',
//   messageType: 'OTP',
//   confidence: 0.95,
//   processingTime: 125
// }
```

```javascript
// Batch processing
const smsList = [
  {
    phoneNumber: '+1-555-123-4567',
    sender: 'BANK',
    rawContent: 'Your OTP is 123456'
  },
  {
    phoneNumber: '+1-555-234-5678',
    sender: 'AMAZON',
    rawContent: 'Order #12345 confirmed. Amount: ₹5000'
  }
];

const batchResult = await SMSProcessor.processBatch(smsList);
console.log(batchResult);
```

```javascript
// Get statistics
const stats = await SMSProcessor.getStatistics(24);
console.log(stats);
// Output: { totalSMS: 450, byMessageType: {...}, ... }
```

### Directly with Parser Service

```javascript
const SMSParser = require('./services/smsParser');

const parsed = SMSParser.parseSMS('Your OTP is 789456. Valid for 5 minutes.');

console.log(parsed);
// Output:
// {
//   messageType: 'OTP',
//   extractedInfo: { otp: '789456', keywords: ['otp', 'valid'] },
//   confidence: 0.95
// }
```

### Validation

```javascript
const SMSValidator = require('./utils/smsValidator');

// Validate individual fields
const isValidPhone = SMSValidator.isValidPhoneNumber('+1-555-123-4567'); // true

const isValidSender = SMSValidator.isValidSender('BANK123'); // true

// Validate complete SMS object
const validation = SMSValidator.validateSMSObject({
  phoneNumber: '+1-555-123-4567',
  sender: 'BANK',
  rawContent: 'Your OTP is 123456'
});

console.log(validation);
// { isValid: true, errors: [] }
```

## Background Worker Tasks

### 1. Retry Failed SMS (Every 5 minutes)
- Fetches SMS with status FAILED
- Attempts to re-parse and process
- Updates status on success
- Stops after 3 attempts

### 2. Generate Statistics (Every hour)
- Computes message type distribution
- Calculates processing status breakdown
- Measures spam detection rate
- Logs average confidence scores

### 3. Cleanup Old Records (Daily)
- Deletes SMS older than 30 days
- Only removes FAILED or SUCCESS records
- Prevents database bloat
- Configurable via API parameter

## Error Handling

### Common Errors

| Error | Code | Status | Fix |
|-------|------|--------|-----|
| Invalid phone number | `SMS_VALIDATION_ERROR` | 400 | Use valid phone format: +1-555-123-4567 |
| Duplicate SMS | `DUPLICATE` | 200 | Normal - same SMS already processed |
| Processing failed | `SMS_PROCESSING_ERROR` | 500 | Check logs, automatic retry in 5 min |
| Unauthorized | `FORBIDDEN` | 403 | Use valid JWT token |
| Batch too large | `VALIDATION_ERROR` | 400 | Max 1000 SMS per batch |

### Retry Logic

- Automatic retry: Up to 3 attempts
- Retry interval: 5 minutes
- After 3 failures: Marked as FAILED
- Manual retry: Via `/api/v1/sms/retry-failed` endpoint

## Performance Optimizations

### Database Indexes
- `phoneNumber, receivedAt` (sorted query)
- `parsedData.messageType` (filtering)
- `processingStatus` (worker queries)
- `user, receivedAt` (user-specific queries)

### Batch Processing
- Default batch size: 10
- Maximum items: 1000
- Promise.allSettled for error resilience
- Parallel processing within batches

### Caching
- Duplicate detection (5-minute window)
- Statistics aggregation (hourly)
- Index-based fast lookups

## Logging

All operations are comprehensively logged:

```
[INFO] SMS processed successfully
  smsId: 507f1f77bcf86cd799439011
  messageType: OTP
  processingTime: 145ms
  confidence: 0.95

[WARN] Duplicate SMS detected
  phoneNumber: +1-555-123-4567
  content: Your OTP is 123456...

[ERROR] SMS processing error
  error: Invalid content
  phoneNumber: +1-555-123-4567
  stack: ...
```

## Security Considerations

1. **Input Validation**: All inputs validated before processing
2. **Sanitization**: Control characters removed, whitespace normalized
3. **Phone Number Validation**: Regex-based format validation
4. **Spam Detection**: Keyword and pattern-based analysis
5. **Rate Limiting**: Applied to API endpoints
6. **Authentication**: All endpoints require valid JWT
7. **Authorization**: Users can only access their own SMS

## Best Practices

### For API Consumers

```javascript
// ✅ DO: Use batch processing for multiple SMS
await fetch('/api/v1/sms/batch', {
  method: 'POST',
  body: JSON.stringify({ smsList: [...1000 items] })
});

// ❌ DON'T: Send 1000 individual requests
for (const sms of smsList) {
  await fetch('/api/v1/sms/process', { body: JSON.stringify(sms) });
}
```

```javascript
// ✅ DO: Handle duplicate responses gracefully
if (response.data.status === 'DUPLICATE') {
  console.log('SMS already processed');
}

// ✅ DO: Use pagination for listing
const page1 = await fetch('/api/v1/sms/list?page=1&limit=20');
```

### For Operations

- Monitor worker health: `GET /api/v1/sms/health/status`
- Review statistics hourly: `GET /api/v1/sms/statistics/summary`
- Run manual cleanup weekly: `DELETE /api/v1/sms/cleanup?daysOld=30`
- Check error logs for patterns

## Testing

### Manual Testing with cURL

```bash
# Process single SMS
curl -X POST http://localhost:5000/api/v1/sms/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "sender": "BANK123",
    "content": "Your OTP is 123456. Valid for 5 minutes."
  }'

# Get statistics
curl http://localhost:5000/api/v1/sms/statistics/summary \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check worker health
curl http://localhost:5000/api/v1/sms/health/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### SMS not being parsed

1. Check processingStatus: `GET /api/v1/sms/:id`
2. Review lastError details
3. Trigger manual retry: `POST /api/v1/sms/retry-failed`
4. Check server logs for detailed error messages

### Worker not running

1. Verify status: `GET /api/v1/sms/health/status`
2. Check server logs during startup
3. Confirm MongoDB connection is active
4. Restart server if needed

### High failure rate

1. Check error logs for patterns
2. Validate input data format
3. Review spam detection rules
4. Contact support with sample SMS

## Monitoring Dashboard Data

Key metrics to track:

```javascript
{
  "totalSMS": 10000,
  "successRate": 0.98,
  "averageConfidence": 0.87,
  "spamDetectionRate": 0.12,
  "averageProcessingTime": "145ms",
  "workerStatus": "running",
  "failedSMSCount": 200,
  "retryQueueSize": 45
}
```

## Future Enhancements

- [ ] Machine learning-based classification
- [ ] Real-time push notifications
- [ ] Advanced spam filter training
- [ ] Multi-language support
- [ ] Webhook integration
- [ ] Redis caching layer
- [ ] GraphQL API
- [ ] Analytics dashboard

## Support & Contact

For issues or questions:
1. Check logs: `backend/logs/`
2. Review error codes in documentation
3. Contact development team with SMS ID and timestamp

---

**Version**: 1.0.0  
**Last Updated**: April 24, 2024  
**Status**: Production-Ready ✓
