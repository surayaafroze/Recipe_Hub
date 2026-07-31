<div align="center">
  <h1>🍳 RecipeHub</h1>
  <p><strong>A Modern, Feature-Rich Full-Stack Recipe Sharing Platform</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Stripe](https://img.shields.io/badge/Stripe-Payments-6772E5?style=for-the-badge&logo=stripe)](https://stripe.com/)
  [![Better Auth](https://img.shields.io/badge/Better_Auth-Security-green?style=for-the-badge)](https://better-auth.com/)
</div>

<br />

<div align="center">
  <img src="https://i.ibb.co.com/nNDbWNTW/Gemini-Generated-Image-j367ucj367ucj367.png" alt="Recipe Hub Banner" width="100%" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
</div>

<br />

## 🌐 Live Application
🔗 **[https://recipe-hub-gamma-nine.vercel.app/](https://recipe-hub-gamma-nine.vercel.app/)**

---

## 📖 Project Overview
**RecipeHub** is a full-stack web application designed for food lovers to discover, publish, and manage recipes seamlessly. The platform features robust authentication, fine-grained role-based access control (RBAC), premium user subscriptions via Stripe, interactive search & filter capabilities, and an administrative dashboard for system-wide control.

Built with performance, responsiveness, and user experience as core priorities, RecipeHub utilizes Next.js 15 App Router, React 19, and Tailwind CSS.

---

## ✨ Key Features

### 👤 User Capabilities
- **Recipe Discovery**: Filter, search, and browse high-quality recipe collections.
- **Recipe Publishing & Management**: Create, edit, and delete personal recipes easily.
- **Favorites Collection**: Save and organize favorite recipes for quick access.
- **User Reporting**: Submit feedback or report inappropriate content to moderators.
- **Theme Support**: Seamless Dark/Light mode switching.
- **Profile Dashboard**: Monitor user activity, added recipes, and favorite dishes.
- **Interactive UI**: Micro-interactions and fluid animations powered by Framer Motion.
- **Instant Notifications**: Real-time user feedback with React Hot Toast.

### 🛡️ Admin Dashboard
- **Analytics & Overview**: Monitor real-time counts for Users, Recipes, Reports, and Revenue.
- **User Moderation**: View all accounts with instant block/unblock enforcement.
- **Recipe Moderation**: Edit, feature, or delete any community recipe.
- **Financial Tracking**: Track Stripe premium membership purchases and transactions.
- **Report Resolution**: Inspect and resolve user-flagged content.

### 🔐 Security & Auth
- **Better Auth Integration**: Production-ready authentication.
- **Google OAuth**: Fast one-click social authentication.
- **Protected Routing**: Next.js middleware guards `/dashboard` and `/admin` routes.

### 💎 Premium Subscription
- **Stripe Checkout**: Secure payment processing for premium membership.
- **Creation Perks**: Premium users bypass creation limits and earn custom badges.

---

## 💻 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS, Next Themes
- **Authentication**: Better Auth
- **State Management & Validation**: React Hook Form, Zod
- **Animations**: Framer Motion
- **Payments**: Stripe Checkout
- **Toast Notifications**: React Hot Toast
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/surayaafroze/Recipe_Hub.git
cd Recipe_Hub/recipe-hub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

<div align="center">
  <p>Crafted with ❤️ for Recipe Hub Community</p>
</div>

