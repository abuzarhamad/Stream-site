# Streamify Backend

This is the Express API for the Streamify frontend.

## Quick start

1. Copy `.env.example` to `.env`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API base URL

The local development API is configured for:

```text
http://localhost:5002/api
```

## Included endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/onboarding`
- `GET /api/user/`
- `GET /api/user/friends`
- `POST /api/user/friend-request/:userId`
- `PUT /api/user/friend-request/:userId/accept`
- `GET /api/user/friend-requests`
- `GET /api/user/outgoing-friend-requests`
- `GET /api/chat/token`

## Notes

This version stores data in memory for local development and is designed to match the frontend contract. It is ready to be swapped for a database-backed implementation later.
