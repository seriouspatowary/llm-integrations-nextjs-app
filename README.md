# Track-Amount – Personal Expense & Income Tracker

A modern, premium, mobile-first fintech web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 📱 Mobile-First Design & Architecture

- **Primary Target Dimensions**: 375px–430px (Responsive mobile layout with interactive desktop preview shell).
- **Fintech Aesthetic**: Deep Indigo/Blue primary `#1E1B4B`, `#4F46E5`, Emerald Green `#10B981` for income, and Rose `#EF4444` for expenses.
- **Micro-Interactions**: Fluid spring animations, rounded cards (`rounded-3xl`), glassmorphic panels, bottom navigation with layoutId pills, and native status bar styling.

---

## 🚀 Key Modules & Capabilities

### 1. Animated Splash Screen
- Animated wallet logo with radiant pulsing rings.
- Dynamic branding: "Track-Amount" – *Take Control of Your Money.*
- Loading progress bar and smooth transition to Authentication.

### 2. Dual-Role Authentication
- **Expense User**: Personal finance tracking, monthly budgeting, category insights, and standard assistant queries.
- **RAG User**: Enhanced AI Retrieval-Augmented Generation mode grounded on user transaction records, financial synthesis, and receipt metadata.
- Email & password validation with visibility toggle, "Remember Me", "Forgot Password", and 1-click demo login buttons.

### 3. Main Dashboard
- **Header**: Dynamic greeting, user profile avatar with active indicator, role badge, and notification center.
- **Summary Cards**:
  - **Total Balance**: Luxury card with monthly budget progress bar and balance visibility toggle.
  - **Total Income**: Emerald card with inflow metrics.
  - **Total Expenses**: Rose card with outflow metrics.
- **Quick Action Bar**: 1-tap shortcuts for Expense, Income, AI Assistant, and Reports.
- **Analytics Charts**: Toggle between Income vs. Expense cashflow bars and Category breakdown progress indicators.
- **Recent Transactions**: Real-time list with detailed drill-down modal and receipt indicators.

### 4. Bottom Navigation & Primary Tabs
- **Add Expense (Tab 1)**: Large currency input, visual category selector (Food, Travel, Shopping, Medical, Education, Entertainment, Rent, Bills, Others), payment methods (UPI, Cash, Cards, Bank Transfer), date picker, notes, and file upload for receipts.
- **Add Income (Tab 2)**: Inflow amount, source classification (Salary, Business, Freelancing, Investment, Rental, Other), payment method, and instant balance update.
- **Ask Track-Amount (Tab 3)**:
  - AI chat interface with interactive suggestions.
  - Answers queries on spending, income, top categories, monthly comparisons, and personalized financial tips.
  - RAG mode indicator with vector context synthesis.

### 5. Additional Views
- **Transaction History**: Filter by All / Expense / Income, full-text search, category filters, and CSV export.
- **Financial Reports**: Savings rate %, daily average spend, financial discipline score (Grade A), and full category distributions.
- **Profile & Settings**: Profile editor, monthly budget targets, currency selection, demo data reset, and logout confirmation modal.

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) on your mobile browser or desktop.

