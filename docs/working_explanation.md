# FitSteps Frontend - Comprehensive Working Explanation

## 1. Overview and Architecture
FitSteps is a React (Vite) single-page application (SPA). It acts as the presentation layer, relying entirely on the `fitsteps-backend` FastAPI server for database interactions and authentication.

**Key Architectural Decisions:**
- **State Management:** React Context (`AuthContext.jsx`) is used for global state (user login status), while component-level state (`useState`) handles local UI data (like charts and modals).
- **Styling Strategy:** Tailwind CSS is used for utility-first inline styling, avoiding complex CSS stylesheets. Custom color palettes (slate, emerald) create a premium dark-mode aesthetic.
- **Routing:** `react-router-dom` intercepts URL changes in the browser and mounts the correct page component dynamically without reloading the browser.

---

## 2. Authentication Logic & Flow
Authentication is the core foundation that protects user data.

### The `AuthContext` Provider
Located in `src/context/AuthContext.jsx`, this component wraps the entire application.
1. **Login Flow:** When a user submits their email/password on the Login page, Axios sends a `POST` request to `/auth/login` containing `x-www-form-urlencoded` data.
2. **Token Storage:** The backend returns an `access_token` (a JWT). The `AuthContext` saves this token to `localStorage` (so the user stays logged in even if they close the tab).
3. **Persisting the Session:** On initial load, `AuthContext` checks `localStorage`. If a token exists, it makes a quick `GET /auth/me` request. If the backend confirms the token is valid, the user's details (like ID and name) are loaded into global state.

### Axios Interceptor (`src/services/api.js`)
Instead of manually adding the JWT token to every single API call, we use an Axios Interceptor:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
**Example Logic:** Every time a component calls `api.get('/activities/')`, Axios silently intercepts it, grabs the token, and attaches it. If the token expires and the backend throws a `401 Unauthorized`, the interceptor catches it, clears `localStorage`, and forcibly logs the user out.

---

## 3. Dashboard Component Logic (`Dashboard.jsx`)
The dashboard aggregates multiple data streams to give the user a complete overview.

### A. Data Fetching (Concurrency)
When the dashboard mounts, it runs `fetchDashboardData()`. To ensure fast loading times, it uses `Promise.all` to fetch all three APIs simultaneously rather than waiting for one to finish before starting the next:
```javascript
const [gamificationRes, activitiesRes, analyticsRes] = await Promise.all([
    api.get('/gamification/summary'),
    api.get('/activities/'),
    api.get('/analytics/')
]);
```
* **Fallback Logic:** If any of these throw an error (e.g., a 500 server error), the `.catch()` block catches it and sets the state to safe default values (like `0` or `{}`) so the rest of the application doesn't crash completely.

### B. Chart Data Calculation
The Dashboard uses the `Recharts` library to draw the activity graph. However, the backend returns raw activities, so the frontend must group and calculate them.

**Logic Example:**
If the user selects the date range "July 12 to July 18":
1. **Filter:** The code loops through the raw `activities` array and filters out any activity that didn't occur between `startStr` and `endStr`.
2. **Reduce (Group by Day):** Multiple activities on the same day must be merged.
```javascript
const grouped = rangeActivities.reduce((acc, a) => {
  const dateStr = format(parseUTCDate(a.activity_date), 'yyyy-MM-dd');
  if (!acc[dateStr]) acc[dateStr] = 0; // Initialize day to 0
  acc[dateStr] += a.steps; // Add steps
  return acc;
}, {});
```
3. **Map (Fill missing days):** If the user didn't log any activities on July 14, Recharts still needs a data point of `0` so the line doesn't break. The code generates an array of every single day in the interval, looks up the steps in the `grouped` object, and sets it to `0` if undefined.

### C. Gemini AI Integration
The AI daily goal is fetched silently in the background:
```javascript
api.post('/ai/recommendation').then(res => setAiRecommendation(res.data))
```
While waiting, the UI explicitly displays `"Calculating..."`. Once the Promise resolves, the component state updates, triggering a re-render that displays the personalized `recommended_steps`.

---

## 4. Gamification Logic (`Achievements.jsx`)
The application awards badges and tracks streaks to motivate users.

### Server-Side Authority
The frontend *never* decides if a badge is earned. This prevents users from simply hacking the frontend to unlock all badges. 
1. The backend evaluates badge eligibility during the `/activities/` POST request (when an activity is saved).
2. The frontend simply fetches the result via `GET /gamification/summary`.
3. If the user has badges, it loops through `gamification.earned_badges` and renders the icons. If the array is empty `[]`, it renders a fallback "No Badges Yet" UI.

---

## 5. Goals Tracker Logic (`Goals.jsx`)
Users can set a target number of steps.

### Completion Calculation
When the page loads, it fetches the user's active goals and the user's total steps logged **today**.
```javascript
// Calculate percentage logic inside the render function
const percentage = Math.min(Math.round((todaySteps / goal.target_steps) * 100), 100);
```
**Example:** If the user's goal is `10,000` steps, and `todaySteps` is `4,500`:
- `(4500 / 10000) * 100 = 45%`
- The `Math.min(..., 100)` logic ensures that if the user walks `12,000` steps, the progress bar doesn't break out of its container by going to 120%. It caps the visual progress at 100%.

---

## 6. Real-Time Interactions (Modals)
When a user clicks "Log Activity", they don't navigate to a new page. Instead, a Modal pops up.
* **State Management:** Controlled by `const [isModalOpen, setIsModalOpen] = useState(false);`
* **Form Submission:** When the user clicks "Save", the `handleSubmit` function prevents default form submission (`e.preventDefault()`), sends a `POST` request to `/activities/` with the form payload, and if successful, immediately calls `fetchDashboardData()` to force the charts and stats to refresh instantly without a page reload.
