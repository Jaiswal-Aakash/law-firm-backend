# Mansoor App Backend

A simple Node.js backend API built with Express.js following MVC architecture with PostgreSQL database.

## Project Structure

```
mansoor_app_backend/
├── config/          # Configuration files (database)
├── models/          # Data models
├── controllers/     # Business logic
├── routes/          # API routes
├── database/        # Database initialization scripts
├── index.js         # Main server file
├── package.json     # Dependencies
└── .env            # Environment variables
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file and add your PostgreSQL database URL:
```bash
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

**Example DATABASE_URL formats:**
- Local: `postgresql://postgres:password@localhost:5432/mansoor_app`
- Cloud (Heroku, Railway, etc.): `postgresql://user:pass@host:5432/dbname?sslmode=require`
- Connection Pool: `postgresql://user:pass@host:5432/dbname?connection_limit=10`

3. Initialize the database (creates tables):
```bash
npm run init-db
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Case Details

- `GET /api/case-details` - Get all case details (optional query: `?createdBy=user123`)
- `GET /api/case-details/:id` - Get case details by ID (or SC Number if not numeric)
- `GET /api/case-details/sc/:scNo` - Get case details by SC Number
- `POST /api/case-details` - Create new case details
- `PUT /api/case-details/:id` - Update case details
- `DELETE /api/case-details/:id` - Delete case details

### Case Accused Details

- `GET /api/case-accused-details` - Get all accused details (optional query: `?caseId=1` or `?createdBy=user123`)
- `GET /api/case-accused-details/:id` - Get accused details by ID (or accused_no if not numeric)
- `GET /api/case-accused-details/case/:caseId` - Get accused details by case ID
- `GET /api/case-accused-details/accused/:accusedNo` - Get accused details by accused number
- `POST /api/case-accused-details` - Create new accused details
- `PUT /api/case-accused-details/:id` - Update accused details
- `DELETE /api/case-accused-details/:id` - Delete accused details

### Case Complainant Details

- `GET /api/case-complainant-details` - Get all complainant details (optional query: `?caseId=1` or `?createdBy=user123`)
- `GET /api/case-complainant-details/:id` - Get complainant details by ID
- `GET /api/case-complainant-details/case/:caseId` - Get complainant details by case ID
- `POST /api/case-complainant-details` - Create new complainant details
- `PUT /api/case-complainant-details/:id` - Update complainant details
- `DELETE /api/case-complainant-details/:id` - Delete complainant details

## Example Requests

Create a user:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

Create case details:
```bash
curl -X POST http://localhost:3000/api/case-details \
  -H "Content-Type: application/json" \
  -d '{"description": "Case description here", "scNo": "SC001", "createdBy": "user123"}'
```

Get all case details:
```bash
curl http://localhost:3000/api/case-details
```

Get case details by SC Number:
```bash
curl http://localhost:3000/api/case-details/sc/SC001
```

Create accused details:
```bash
curl -X POST http://localhost:3000/api/case-accused-details \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": 1,
    "caName": "John Doe",
    "caPhoneNumber": "1234567890",
    "caEmail": "john@example.com",
    "caAddress": "123 Main St",
    "accusedNo": "ACC001",
    "caSignaturePath": "/path/to/signature.png",
    "createdBy": "user123"
  }'
```

Get accused details by case ID:
```bash
curl http://localhost:3000/api/case-accused-details/case/1
```

Create complainant details:
```bash
curl -X POST http://localhost:3000/api/case-complainant-details \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": 1,
    "ccName": "Jane Smith",
    "ccAddress": "456 Oak Ave",
    "ccPhoneNumber": "9876543210",
    "ccMail": "jane@example.com",
    "createdBy": "user123"
  }'
```

Get complainant details by case ID:
```bash
curl http://localhost:3000/api/case-complainant-details/case/1
```

## Database

The application uses PostgreSQL. The database connection is configured via the `DATABASE_URL` environment variable. The database tables are automatically initialized when the server starts.

### Database Schema

- **users** table:
  - `id` (SERIAL PRIMARY KEY)
  - `name` (VARCHAR(255))
  - `email` (VARCHAR(255) UNIQUE)
  - `created_at` (TIMESTAMP)

- **tblCaseDetails** table:
  - `case_id` (SERIAL PRIMARY KEY)
  - `description` (TEXT NOT NULL)
  - `sc_no` (VARCHAR(255) UNIQUE NOT NULL)
  - `created_on` (TIMESTAMP)
  - `created_by` (VARCHAR(255))

- **tblCaseAccusedDetails** table:
  - `ca_id` (SERIAL PRIMARY KEY)
  - `case_id` (INTEGER NOT NULL - Foreign Key)
  - `ca_name` (VARCHAR(255) NOT NULL)
  - `ca_phone_number` (VARCHAR(50))
  - `ca_email` (VARCHAR(255))
  - `ca_address` (TEXT)
  - `accused_no` (VARCHAR(255))
  - `ca_signature_path` (VARCHAR(500))
  - `created_on` (TIMESTAMP)
  - `created_by` (VARCHAR(255))

- **tblCaseComplainantDetails** table:
  - `cc_id` (SERIAL PRIMARY KEY)
  - `case_id` (INTEGER NOT NULL - Foreign Key)
  - `cc_name` (VARCHAR(255) NOT NULL)
  - `cc_address` (TEXT)
  - `cc_phone_number` (VARCHAR(50))
  - `cc_mail` (VARCHAR(255))
  - `created_on` (TIMESTAMP)
  - `created_by` (VARCHAR(255))

## Technologies

- Node.js
- Express.js
- PostgreSQL (pg)
- dotenv

