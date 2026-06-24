# 🍳 RecipeHub — Recipe Sharing Platform

A full-stack recipe sharing platform where food enthusiasts can create, share, discover, and manage recipes.

[![Live Site](https://img.shields.io/badge/Live-RecipeHub-indigo)](http://localhost:3000)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com)

---

## 🚀 Features

### 👤 User Features
- 📝 **Recipe Management** — Create (max 2), update, and delete own recipes
- 🔍 **Browse & Filter** — Browse all recipes, filter by category (server-side with MongoDB `$in`)
- ❤️ **Likes & Favorites** — Like recipes, save to personal favorites list
- 💳 **Stripe Payments** — Purchase individual recipes or upgrade to Premium
- ⭐ **Premium Membership** — Unlimited recipe creation + premium badge
- 📊 **Dashboard Overview** — View stats (total recipes, favorites, likes received)
- 🧑‍💼 **Profile Management** — Update name and profile image

### 🛡️ Admin Features
- 👥 **User Management** — View all users, block/unblock accounts
- 🍲 **Recipe Management** — Delete any recipe, mark as Featured
- 🚩 **Reports** — Review reported recipes, dismiss or remove
- 📊 **Platform Stats** — Total users, recipes, premium members, revenue
- 💰 **Transactions** — View all payment history

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Auth** | Better Auth (session-based, Google OAuth) |
| **Payments** | Stripe Checkout |
| **Image Upload** | ImgBB API |
| **Icons** | Lucide React |
| **Toasts** | React Hot Toast |

---

## 📁 Project Structure

```
recipe-hub/
├── src/
│   ├── app/
│   │   ├── (public routes)
│   │   │   ├── page.js               # Home page
│   │   │   ├── browse-recipes/       # Browse & filter recipes
│   │   │   ├── recipe/[id]/          # Recipe details
│   │   │   ├── login/                # Login page
│   │   │   └── register/             # Registration page
│   │   ├── dashboard/
│   │   │   ├── page.jsx              # Dashboard overview
│   │   │   ├── add-recipe/           # Add new recipe
│   │   │   ├── my-recipes/           # Manage own recipes
│   │   │   ├── favorites/            # Favorite recipes
│   │   │   ├── purchased-recipes/    # Purchased recipes
│   │   │   ├── profile/              # Profile management
│   │   │   └── admin/                # Admin panel
│   │   ├── payment-success/          # Stripe success page
│   │   ├── blocked/                  # Blocked account page
│   │   ├── api/auth/                 # Better Auth API routes
│   │   ├── not-found.jsx             # Custom 404 page
│   │   ├── loading.jsx               # Global loading state
│   │   └── error.jsx                 # Error boundary
│   ├── components/
│   │   ├── Navbar.jsx                # Responsive navbar with theme toggle
│   │   ├── ThemeToggle.jsx           # Dark/Light mode switch
│   │   ├── dashboard/DashboardStats.jsx
│   │   ├── modals/ReportModal.jsx
│   │   └── shared/Footer.jsx
│   ├── lib/
│   │   ├── auth.js                   # Better Auth server config
│   │   └── auth-client.js            # Better Auth client config
│   └── middleware.js                 # Next.js route protection middleware
├── .env                              # Environment variables (NOT committed)
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Better Auth
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000

# MongoDB
MONGO_DB_URI=mongodb+srv://user:password@cluster.mongodb.net/
AUTH_DB_NAME=Recipe_Hub

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Public Environment Variables
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_UPLOAD_API=your_imgbb_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

> ⚠️ **Never commit `.env` to version control!**

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account (for payments)
- Google OAuth credentials
- ImgBB API key

### Installation

```bash
# Clone the repository
git clone https://github.com/surayaafroze/Recipe_Hub.git
cd Recipe_Hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication

RecipeHub uses **Better Auth** for secure, session-based authentication.

- **Credential Login** — Email + password
- **Google OAuth** — One-click Google sign-in
- **HTTP-only Cookies** — Session tokens stored securely, never exposed to JavaScript
- **Route Protection** — Next.js middleware guards all `/dashboard/*` routes
- **RBAC** — Role-based access control (User / Admin)

---

## 💳 Premium Membership

Users can upgrade to **Premium** for **$15.00** via Stripe Checkout:

| Feature | Free User | Premium User |
|---|---|---|
| Recipe Creation | Max 2 | Unlimited |
| Premium Badge | ❌ | ✅ |
| Browse Recipes | ✅ | ✅ |
| Favorites | ✅ | ✅ |
| Recipe Purchase | ✅ | ✅ |

---

## 📊 Database Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles + roles + premium status |
| `recipes` | All recipes with metadata |
| `favorites` | User → Recipe favorite mappings |
| `reports` | Recipe reports from users |
| `payments` | Stripe payment transactions |

---

## 🔒 Security

- ✅ MongoDB credentials stored in environment variables only
- ✅ `.env` excluded from Git via `.gitignore`  
- ✅ HTTP-only session cookies (not accessible by JS)
- ✅ All protected API routes require authentication
- ✅ Admin routes require `role === 'admin'`
- ✅ Blocked users denied access to all protected routes
- ✅ CORS configured with `credentials: true` and specific origin

---

## 🌐 Deployment

The application is deployed and accessible at the live URL. For production:

1. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to your production domain
2. Set `CLIENT_URL` in the backend to your production domain
3. Update CORS origin in backend `index.js`
4. Ensure MongoDB Atlas IP whitelist includes your server IP
5. Set `NODE_ENV=production`

---

## 📝 License

This project is for educational assessment purposes.

---

*Built with ❤️ for RecipeHub Platform Assessment*
