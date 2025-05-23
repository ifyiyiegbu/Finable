# Finable

A secure financial account creation API built with Node.js, Express, and MongoDB that provides encrypted storage of sensitive customer data.

## Table of Contents

- Overview

- Features

- Technology Stack

- System Architecture

- Prerequisites

- Installation

- API Documentation and Endpoints

- Project Structure

- Known Issues

- Future Improvements

- Contributors

- Contributing

- Acknowledgments

## Overview

Finable is a RESTful API service designed for financial institutions to securely create and manage customer accounts. The system automatically generates account numbers, card details, and implements AES-256-GCM encryption for sensitive data protection. It provides both encrypted and decrypted views of customer information while maintaining data security standards.

## Features

Core Functionality

Account Creation: Create new customer accounts with personal information
Data Encryption: AES-256-GCM encryption for sensitive data (phone numbers, dates of birth, card details)
Account Retrieval: Fetch individual account details by account number
Account Listing: Get all accounts with both encrypted and decrypted views
Data Decryption: Standalone endpoint for decrypting encrypted data

Security Features

Field-Level Encryption: Phone numbers, dates of birth, and card details are encrypted
Secure Key Management: Environment-based encryption key configuration
Data Validation: Input validation using express-validator
Security Headers: Helmet.js for security headers
CORS Support: Configurable cross-origin resource sharing

System Features

Automatic Generation: Account numbers and card details generated automatically
Comprehensive Logging: Winston-based logging with multiple levels
Error Handling: Centralized error handling with operational error classification
Health Monitoring: Health check endpoint for system monitoring
Request Logging: Detailed request/response logging with timing

## Technology Stack

Backend

Runtime: Node.js (>=18.0.0)
Framework: Express.js 5.1.0
Language: TypeScript 5.8.3
Database: MongoDB with Mongoose ODM

Security & Utilities

Encryption: Node.js Crypto (AES-256-GCM)
Validation: express-validator
Security: Helmet.js
Logging: Winston
Environment: dotenv for configuration

Development Tools

Process Manager: Nodemon for development
TypeScript: ts-node for development execution
Package Manager: npm

## System Architecture

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client API    │────│   Express App    │────│   MongoDB       │
│   Requests      │    │                  │    │   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              │
                       ┌──────────────────┐
                       │ Encryption Layer │
                       │   (AES-256-GCM)  │
                       └──────────────────┘
Data Flow

Request Reception: Express receives and validates incoming requests
Data Processing: Business logic processes account creation/retrieval
Encryption/Decryption: Sensitive data is encrypted before storage or decrypted for response
Database Operations: MongoDB operations through Mongoose ODM
Response Formation: Structured JSON responses with both encrypted and decrypted data
Logging: All operations logged through Winston

## Prerequisites

Node.js: Version 18.0.0 or higher
npm: Version 8.0.0 or higher
MongoDB: Running MongoDB instance (local or cloud)
Environment Variables: Properly configured environment file

## Installation

- Clone the Repository
  
git clone `https://github.com/ifyiyiegbu/Finable.git`
cd finable

- Install Dependencies
npm install

- Environment Configuration

Create a .env file in the root directory

Database Configuration
MONGODB_URI=mongodb:(mongodb+srv://your_connection_string)

Encryption Configuration (64 hex characters = 32 bytes)
ENCRYPTION_KEY=your_64_character_hex_key_here

Server Configuration
PORT=3000
NODE_ENV=development

Logging Configuration
LOG_LEVEL=info

- Generate Encryption Key

Generate a 32-byte encryption key:
bashnode -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

- Build the Application

npm run build

- Start the Application

Development Mode:
npm run dev

Production Mode:
npm start

## API Documentation and Endpoints

Base URL:
`https://finable-gbl7.onrender.com`

Link to API Documentation:
`https://documenter.getpostman.com/view/43143865/2sB2qak2qh`

Request Validation
All API endpoints include comprehensive validation:

firstName/surname: Required strings
email: Valid email format
phoneNumber: Valid mobile phone number
dateOfBirth: Valid date in YYYY-MM-DD format

Error Responses
json{
  "status": "error",
  "message": "Descriptive error message"
}

Common HTTP Status Codes

200: Success
201: Created
400: Bad Request (validation errors)
404: Not Found
409: Conflict (duplicate email/phone)
500: Internal Server Error

Generated Data Specifications
Account Number Format:

10 digits
First 2 digits: extracted from 2nd and 3rd digits of phone number
Remaining 8 digits: randomly generated

Card Number Format:

16 digits
Prefix: 5599 (fixed)
Remaining 12 digits: randomly generated

CVV:

3 digits
Randomly generated (100-999)

Expiry Date:

Format: MM/YY
Always 3 years from current date

## Project Structure

finable/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   ├── encryption.ts        # Encryption key management
│   │   └── index.ts            # Main configuration
│   ├── controllers/
│   │   └── account.controller.ts # Request handlers
│   ├── interfaces/
│   │   ├── account.interface.ts  # Account type definitions
│   │   └── error.interface.ts   # Error type definitions
│   ├── middleware/
│   │   ├── error.middleware.ts   # Error handling
│   │   ├── logger.middleware.ts  # Request logging
│   │   └── validation.middleware.ts # Input validation
│   ├── models/
│   │   └── account.model.ts     # MongoDB schema
│   ├── routes/
│   │   └── account.routes.ts    # API routes
│   ├── services/
│   │   ├── account.service.ts   # Business logic
│   │   └── encryption.service.ts # Encryption/decryption
│   ├── utils/
│   │   └── logger.ts           # Logging configuration
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server startup
├── dist/                       # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md

## Known Issues

Current Limitations

- Phone Number Uniqueness Check: Requires decrypting all existing phone numbers for comparison (performance impact)
- No Authentication: API endpoints are currently public (not production-ready)
- Limited Error Context: Some error messages could be more descriptive
- No Rate Limiting: API doesn't implement request rate limiting
- No Test Suite: Automated testing not implemented

Performance Considerations

- Encryption/decryption operations for large datasets may impact response times
- Phone number uniqueness validation becomes slower as database grows
- No caching mechanism for frequently accessed data

## Future Improvements

Security Enhancements

- Implement JWT-based authentication
- Add role-based access control (RBAC)
- Implement API rate limiting
- Add request signing/verification
- Implement data masking for logs

Performance Optimizations

- Add Redis caching layer
- Implement database indexing strategy
- Add connection pooling
- Optimize encryption/decryption operations
- Implement pagination for account listing

Feature Additions

- Account status management (active/inactive/suspended)
- Transaction history tracking
- Account balance management
- Audit trail for all operations
- Bulk account operations

Development & Operations

- Comprehensive test suite (unit, integration, e2e)
- Docker containerization
- CI/CD pipeline setup
- Monitoring and metrics collection
- Documentation automation
- Database migration system

Data Management

- Data backup and recovery procedures
- Data retention policies
- GDPR compliance features
- Data export/import functionality

## Contributors

This project is currently maintained by the development team.

## Contributing

We welcome contributions to improve Finable! Please follow these guidelines:

Development Guidelines

- Follow existing code style and conventions
- Add TypeScript types for all new code
- Include comprehensive error handling
- Add logging for significant operations
- Update documentation for new features

Pull Request Process

- Ensure your code follows the existing style
- Add or update tests as needed
- Update documentation if required
- Ensure all tests pass
- Create a detailed pull request description

Code Standards

- Use TypeScript strict mode
- Follow ESLint configuration
- Include JSDoc comments for public methods
- Use meaningful variable and function names
- Implement proper error handling

How to Contribute

- Fork the repository
- Create a feature branch
- Make your changes
- Add tests for new functionality
- Submit a pull request

## Acknowledgments

Technologies Used

- Express.js - Web framework for Node.js
- MongoDB & Mongoose - Database and ODM
- Winston - Logging library
- Helmet - Security middleware
- express-validator - Input validation

Security Standards

- AES-256-GCM - Authenticated encryption
- OWASP Guidelines - Security best practices
- Node.js Security - Platform-specific security measures
