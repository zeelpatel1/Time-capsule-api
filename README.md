# Time Capsule Messaging API

A backend service that allows users to **schedule messages to be delivered in the future**. Users can create an account, authenticate, and store messages that will automatically change status from **PENDING → DELIVERED** when the scheduled time arrives.

---

## Features

* User Registration and Login
* JWT-based Authentication
* Schedule messages for future delivery
* Automatic message delivery using a scheduler
* Message status tracking (PENDING / DELIVERED)
* PostgreSQL database for persistent storage
* Logging of delivered messages

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* node-cron
* JSON Web Token (JWT)
* bcrypt

---

## Project Structure

```
src
 ├── controllers
 │    ├── authController.js
 │    └── messageController.js
 ├── db
 │    └── db.js
 ├── middleware
 │    └── authMiddleware.js
 ├── routes
 │    ├── authRoutes.js
 │    └── messageRoutes.js
 ├── scheduler
 │    └── deliveryWorker.js
 └── server.js
```

---

## Installation

1. Clone the repository

```
git clone <repository-url>
cd time-capsule-api
```

2. Install dependencies

```
npm install
```

3. Create a `.env` file

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

4. Start the server

```
node src/server.js
```

---

## API Endpoints

### Authentication

**Register**

```
POST /auth/register
```

Body:

```
{
  "email": "user@test.com",
  "password": "password123"
}
```

---

**Login**

```
POST /auth/login
```

Body:

```
{
  "email": "user@test.com",
  "password": "password123"
}
```

Returns a JWT token.

---

### Messages

**Create Message**

```
POST /messages
```

Headers:

```
Authorization: Bearer <token>
```

Body:

```
{
  "recipient_email": "person@test.com",
  "message": "Hello from the past!",
  "deliver_at": "2026-03-14T15:30:00"
}
```

---

**Get Messages**

```
GET /messages
```

Headers:

```
Authorization: Bearer <token>
```

Returns all messages created by the authenticated user.

---

## Scheduler

The application uses **node-cron** to run a background worker every minute.

The worker checks for messages where:

```
status = 'PENDING'
deliver_at <= CURRENT_TIMESTAMP
```

and automatically updates them to:

```
status = 'DELIVERED'
```

Delivered messages are logged in:

```
delivery.log
```

---

## Important Note for Deployment

Due to **timezone differences between cloud databases and server environments**, the scheduler may not behave exactly as expected in some deployed environments.

If scheduled messages are **not being delivered at the expected time after deployment**, please run the project **locally** where the system timezone matches the scheduled message time.

Running locally ensures that:

* The scheduler executes correctly
* Time comparisons behave as expected
* Messages are delivered at the scheduled time

---

## Local Testing Recommendation

When testing locally, schedule messages **1–2 minutes in the future**.

Example:

```
deliver_at: 2026-03-14T15:30:00
```

Then monitor the server logs:

```
Checking scheduled messages...
Delivered message <id>
```

---

## Future Improvements

* Email delivery integration
* Timezone normalization
* Message editing and deletion
* Queue-based scheduling system
* Rate limiting
* Message encryption

---

## Author

Developed by **Zeel Dholu**
