# Streamify - Frontend (Next.js)

A modern language learning platform with real-time video chat and friend connection features built with Next.js.

## Features

- 🔐 **Authentication**: Sign up, login, and secure session management
- 👥 **Friend Connections**: Discover users, send friend requests, and manage connections
- 💬 **Chat & Video**: Real-time messaging and video calling with friends
- 🌍 **Language Profiles**: Set native language, learning goals, and proficiency level
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16.3.3
- **UI Library**: React 19.2.8
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS + DaisyUI
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend server running (default: `http://localhost:5000/api`)

## Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Adjust the API URL based on your backend server configuration.

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── layout.js              # Root layout with providers
├── page.js               # Home page (dashboard)
├── globals.css           # Global styles
├── providers.jsx         # Query and toast providers
├── login/
│   └── page.jsx         # Login page
├── signup/
│   └── page.jsx         # Signup page
├── onboarding/
│   └── page.jsx         # Profile setup
├── friends/
│   └── page.jsx         # Browse and add friends
├── notifications/
│   └── page.jsx         # Friend requests
├── chat/
│   └── page.jsx         # Chat & video interface
└── profile/
    └── page.jsx         # User profile view

components/
└── Navbar.jsx           # Navigation bar

hooks/
└── useAuthUser.js       # Authentication hook

lib/
├── api.js              # API client functions
└── axios.js            # Axios instance setup
```

## API Endpoints Used

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/onboarding` - Complete user onboarding

### Users
- `GET /user/` - Get recommended users
- `GET /user/friends` - Get user's friends
- `POST /user/friend-request/:id` - Send friend request
- `PUT /user/friend-request/:id/accept` - Accept friend request
- `GET /user/friend-requests` - Get incoming friend requests
- `GET /user/outgoing-friend-requests` - Get outgoing friend requests

### Chat
- `GET /chat/token` - Get stream token for video calls

## Features Overview

### 🔐 Authentication Flow
1. **Signup**: Create account with email and password
2. **Onboarding**: Set native language and learning preferences
3. **Login**: Access with email and password
4. **Protected Routes**: All app pages require authentication

### 👥 Social Features
1. **Discover Users**: Browse recommended language learners
2. **Send Requests**: Connect with users interested in language exchange
3. **Manage Requests**: Accept or decline incoming friend requests
4. **View Friends**: See all connected friends

### 💬 Communication
1. **Video Calls**: Start real-time video conversations
2. **Messaging**: Send instant messages to friends
3. **Notifications**: Receive friend request notifications

## Styling & Theming

The app uses:
- **Tailwind CSS** for utility-first styling
- **DaisyUI** for component theming
- **Forest theme** as default (can be changed in components)

## Authentication & Security

- Cookies are automatically sent with requests (httpOnly cookies)
- Protected routes redirect unauthenticated users to login
- React Query manages authentication state
- User validation on all protected pages

## Development Tips

### Adding New Pages
1. Create a new folder in `app/`
2. Add `page.jsx` with "use client" directive
3. Import `Navbar` and `useAuthUser` hook
4. Add authentication check in useEffect

### Making API Calls
1. Add function to `lib/api.js`
2. Use React Query hooks in components:
   ```javascript
   const { data, isLoading } = useQuery({
     queryKey: ['key'],
     queryFn: apiFunction,
     enabled: isAuthenticated,
   });
   ```

### Showing Toast Notifications
```javascript
import toast from "react-hot-toast";

toast.success("Success message");
toast.error("Error message");
toast.loading("Loading message");
```

## Troubleshooting

### CORS Issues
- Ensure backend has CORS configured for your frontend URL
- Check `NEXT_PUBLIC_API_URL` matches backend server

### Authentication Not Working
- Verify `.env.local` has correct API URL
- Check browser cookies are enabled
- Ensure backend server is running

### API Calls Failing
- Check backend server is running on configured port
- Verify network request in browser DevTools
- Check backend logs for errors

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [DaisyUI Components](https://daisyui.com/components/)

## License

MIT
