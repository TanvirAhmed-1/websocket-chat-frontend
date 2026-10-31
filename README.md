# 💬 LiveChat — Next-Gen Real-Time Messaging Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.13-purple?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-orange?style=for-the-badge)](https://turbo.build/)

> A high-performance, real-time chat application featuring a modern purple-pill capsule UI, token-based Next.js 16 proxy protection, Redux Toolkit state architecture, live user search by username/phone/email, theme customization, and automated authentication flows.

---

## 📸 Key Interface Highlights

- **Left Navigation Pill Bar:** Vibrant royal purple capsule featuring the user's avatar, navigation icons (`Home`, `Chat` with active white notch, `Notifications`, `Settings`), and account logout.
- **Directory & Contact Sidebar:** Pill-shaped search bar, separate **Groups** and **People** directory cards with unread badges, status dots, and double-check read receipts.
- **Live User Search:** Real-time debounced query by **unique `@username`**, **phone number**, or **email address** displaying **Name on the Left** and **User Avatar on the Right**.
- **Main Chat Workspace:** High-contrast header with voice/video call triggers, smooth message stream with styled sent/received bubbles, and a rounded input bar with attachment, camera, emoji, and voice recording capabilities.
- **Settings & Theme Engine:** Live switching between Light, Dark, and System modes, accompanied by 5 selectable accent color palettes (Royal Purple, Electric Indigo, Ocean Blue, Emerald Green, Rose Pink).
- **Security & Password Rotation:** Live 4-point security checklist and real-time password strength meter.

---

## 🚀 Key Features

### 1. 🛡️ Token-Based Proxy Guard (`src/proxy.ts`)
- Utilizes Next.js 16's official **`proxy.ts`** request interceptor.
- **Public Routes:** `/login`, `/register`, `/signin`.
- **Unauthenticated Protection:** Visitors without a valid session token accessing `/` or private views are automatically redirected to `/login`.
- **Authenticated Protection:** Users already signed in cannot navigate back to `/login` or `/register` and are immediately routed to `/`.
- **Cookie Security:** Managed via server actions (`setTokenCookie` / `removeTokenCookie`) in `storeCookies.ts`.

### 2. ⚡ Registration with Immediate Auto-Login
- Creating an account (`/register`) automatically collects user credentials and unique `@username`.
- On successful account creation, the JWT access token is instantly saved to HTTP cookies and dispatched into the Redux session state.
- The user is transitioned straight into the main chat dashboard (`/`) without requiring an extra sign-in step.

### 3. 🔍 Live User Search (`Phone | Email | Username`)
- Integrated with the backend NestJS search endpoint (`GET /user/search?query=...`).
- Debounced query execution (300ms) prevents unnecessary network requests.
- **Card Layout:**
  - **Left Side:** User Full Name, `@username` badge, email, and phone number.
  - **Right Side:** User Profile Avatar with online activity status dot and quick chat button.
- Clicking any searched user creates or switches to that conversation instantly.

### 4. 👤 Profile & Media Upload
- Complete user profile management (Full Name, Phone, Email, Address, Bio).
- Avatar upload with client-side image validation (size <= 5MB, PNG/JPEG/WEBP).
- Instant FileReader Base64 preview synchronized to Redux Persist and uploaded to the server's Cloudinary storage endpoint.

### 5. 🎨 Customization & Theme System
- **Appearance Modes:**
  - ☀️ **Light Mode:** Crisp, clean day-time palette.
  - 🌙 **Dark Mode:** Deep midnight-slate palette with optimal contrast.
  - 💻 **System Sync:** Follows host operating system settings.
- **5 Accent Color Themes:**
  - 🟣 **Royal Purple** (`#6E00FF`)
  - 🔵 **Electric Indigo** (`#4F46E5`)
  - 🌊 **Ocean Blue** (`#0284C7`)
  - 🟢 **Emerald Green** (`#059669`)
  - 🌸 **Rose Pink** (`#E11D48`)

### 6. 🔒 Password Rotation & Security Checklist
- Built-in `PasswordStrengthIndicator` with real-time feedback:
  - Minimum 6 characters.
  - Contains uppercase & lowercase letters.
  - Contains numbers or special symbols.
  - Password confirmation match.
- Show/Hide visibility toggles (`Eye` / `EyeOff`).

---

## 🏗️ Architecture & Folder Structure

```text
live-chat-frontend/
├── public/
│   ├── icon.svg                     # Vector brand favicon for browsers & mobile
│   └── favicon.ico                  # Legacy favicon fallback
├── src/
│   ├── proxy.ts                     # Next.js 16 official route proxy / middleware
│   ├── app/
│   │   ├── globals.css              # Tailwind v4 configuration & theme variables
│   │   ├── layout.tsx               # Root HTML layout with Redux Providers & Toaster
│   │   ├── page.tsx                 # Main application dashboard (Chat / Settings / Profile)
│   │   ├── icon.svg                 # Native App Router SVG brand icon
│   │   ├── login/
│   │   │   └── page.tsx             # Sign In view
│   │   ├── register/
│   │   │   └── page.tsx             # Create Account view
│   │   └── signin/
│   │       └── page.tsx             # Sign In alias redirect
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx        # Split-screen sign-in form with demo triggers
│   │   │   └── RegisterForm.tsx     # Sign-up form with unique username & auto-login
│   │   ├── chat/
│   │   │   ├── SidebarNav.tsx       # Far-left purple capsule navigation bar
│   │   │   ├── ConversationSidebar.tsx # Contact list, Groups & live search panel
│   │   │   └── ChatArea.tsx         # Conversation stream, bubble rendering & input
│   │   ├── profile/
│   │   │   └── UserProfileView.tsx  # User info editing & avatar photo upload
│   │   ├── settings/
│   │   │   ├── SettingsView.tsx     # Tabbed settings view (Theme, Security, Preferences)
│   │   │   ├── ThemeSection.tsx     # Light/Dark mode & 5 accent color selectors
│   │   │   ├── ChangePasswordSection.tsx # Password rotation with bcrypt/SSL indicators
│   │   │   └── PasswordStrengthIndicator.tsx # 4-level security requirement checklist
│   │   └── ui/                      # Reusable Shadcn UI Primitives
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── lib/
│   │   ├── utils.ts                 # Class merger utility (clsx + tailwind-merge)
│   │   └── Providers/
│   │       └── Providers.tsx        # Client Redux Provider & Toaster container
│   └── redux/
│       ├── store.ts                 # Redux Toolkit store + Redux Persist configuration
│       ├── hook.ts                  # Typed useAppDispatch & useAppSelector hooks
│       ├── storage.ts               # SSR-safe local storage persist engine
│       ├── api/
│       │   └── baseApi.ts           # RTK Query baseApi with dynamic headers & auth interceptor
│       ├── features/
│       │   ├── auth/
│       │   │   ├── authSlice.ts     # User authentication state & profile management
│       │   │   └── authApi.ts       # Login and register RTK Query mutations
│       │   ├── chat/
│       │   │   ├── chatSlice.ts     # Conversations, active chat ID, search & messages
│       │   │   └── chatApi.ts       # User conversations, message history, user search
│       │   └── theme/
│       │       └── themeSlice.ts    # Theme mode & accent color state
│       └── server/
│           └── storeCookies.ts      # Server actions for setting and removing HTTP cookies
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16.4.3** | App Router, Server Actions, Turbopack, and `proxy.ts` |
| **React 19.3.0** | Component Architecture and modern React Hooks |
| **Redux Toolkit 2.13** | Global State Management and normalized slices |
| **RTK Query** | Declarative Data Fetching, caching, and optimistic updates |
| **Redux Persist** | SSR-safe Local Storage session persistence |
| **Tailwind CSS v4** | CSS Variables, modern utilities, and dark-mode styling |
| **Lucide React** | Consistent SVG iconography |
| **React Hot Toast** | Toast notifications for user feedback |
| **Socket.IO Client** | Real-time bidirectional WebSocket events |

---

## ⚙️ Installation & Getting Started

### 1. Prerequisites
- **Node.js:** `v20.x` or higher
- **Package Manager:** `npm`, `pnpm`, or `yarn`
- **Backend:** NestJS + Prisma backend running on `http://localhost:5000` (optional for offline testing; client fallbacks included)

### 2. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/live-chat.git
cd live-chat/live-chat-frontend
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

```bash
npm run build
npm run start
```

---

## 🔌 Backend Integration Overview

The frontend connects to the NestJS + Prisma backend (`web_socket-live-chart-`):

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Registers new user with unique username, email, phone & password |
| `/api/auth/login` | `POST` | Authenticates via email or username and issues JWT access tokens |
| `/api/user/search?query=` | `GET` | Searches users by `@username`, `phone`, `email`, or `name` |
| `/api/message/user-conversations` | `GET` | Fetches active conversations and unread counts for authenticated user |
| `/api/message/:id` | `GET` | Loads message history for a given conversation room |
| `/api/message/start-conversation`| `POST` | Initiates a direct 1-to-1 conversation with a recipient |
| `/api/upload/image` | `POST` | Uploads profile photos and media to Cloudinary |
| `WebSocket Gateway` | `WS` | Real-time events: `sendMessage`, `newMessage`, `typing`, `markAsRead` |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
