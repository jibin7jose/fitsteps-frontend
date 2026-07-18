<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" alt="FitSteps Logo" width="80" height="80">
  <h1 align="center">FitSteps Frontend</h1>
  <p align="center">
    <strong>A sleek, modern, and gamified fitness tracking dashboard.</strong>
  </p>
</div>

<hr />

## ✨ Features

- 📊 **Interactive Dashboard:** View your all-time "Best Day", "Best Week", and "Weekly Average" alongside a dynamic line chart of your step history.
- 🎯 **Daily Goals:** Set, track, and crush your daily step targets with visual progress bars.
- 🏆 **Gamified Achievements:** Earn badges for milestones (e.g., 10k steps, 3-day streak) and track your longest streaks.
- 🤖 **AI Coaching:** Get personalized step recommendations and daily fitness insights powered by Google's Gemini AI.
- 👥 **Global Leaderboard:** See how you stack up against other users in the community.
- 🌙 **Modern Dark Mode:** Beautiful, responsive UI built with Tailwind CSS, featuring glassmorphism and subtle animations.

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Date Utilities:** [date-fns](https://date-fns.org/)

## 🚀 Quick Start (Local Setup)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) installed.

### 1. Clone & Install
```bash
git clone https://github.com/jibin7jose/fitsteps-frontend.git
cd fitsteps-frontend
npm install
```

### 2. Environment Variables
You don't need a `.env` file to start development if your backend is hosted. However, to point the frontend to a local backend, modify the `baseURL` in `src/services/api.js`:
```javascript
// src/services/api.js
const api = axios.create({
  baseURL: 'http://localhost:8000', // Change this to your local backend URL
});
```

### 3. Run the App
```bash
npm run dev
```
The application will start at `http://localhost:5174` (or `5173`).

## 📁 Project Structure

* **`/src/components`** - Reusable UI elements (Navbar, AuthRoute)
* **`/src/context`** - Global state management (AuthContext for JWT tokens)
* **`/src/pages`** - Core application views (Dashboard, Goals, Achievements, Leaderboard)
* **`/src/services`** - Axios configuration and API interceptors
* **`/docs`** - Comprehensive technical documentation and logic explanation

---
*Built with ❤️ for fitness enthusiasts.*
