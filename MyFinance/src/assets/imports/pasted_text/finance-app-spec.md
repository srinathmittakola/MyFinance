Build a complete production-ready Finance Management Web Application using React.

The application must be modern, responsive, highly interactive, user-friendly, visually polished, modular, maintainable, and fully functional.

IMPORTANT:
Do not build only a static UI.
Every major feature must have working CRUD functionality, validation, filtering, searching, sorting, calculations, authentication, persistent data, loading states, empty states, error handling, confirmation dialogs, and responsive behavior.

Use the uploaded dashboard screenshot as the primary visual inspiration for the dashboard.

The screenshot represents a finance/goal dashboard with:
- Dark navy header
- Finance summary cards
- Total goals
- Total target
- Total saved
- Total remaining
- Overall progress
- Circular progress chart
- Goal comparison bar chart
- Individual goal progress
- Financial goals table
- Status indicators
- Financial colors
- Clean white/light dashboard
- Rounded cards
- Professional finance-oriented typography
- Compact but readable layout

Do NOT copy the screenshot pixel-for-pixel.
Create a more modern, premium, responsive and interactive version while preserving its visual concept.

==================================================
1. TECHNOLOGY STACK
==================================================

Use:

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React icons
- Framer Motion
- Recharts

State/Data:
- TanStack Query
- Zustand where global client state is useful

Forms:
- React Hook Form
- Zod validation

Backend:
- Supabase

Use Supabase for:
- Authentication
- PostgreSQL database
- User profiles
- Financial records
- Goals
- Categories
- Transactions
- Budgets
- Recurring transactions
- Notifications
- Settings

Use Supabase Row Level Security so each authenticated user can access only their own financial data.

Architecture must be modular and easy to modify.

==================================================
2. PROJECT STRUCTURE
==================================================

Use a clean scalable structure:

src/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── illustrations/
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Skeleton.tsx
│   │   ├── SearchInput.tsx
│   │   ├── DatePicker.tsx
│   │   ├── CurrencyInput.tsx
│   │   └── Pagination.tsx
│   │
│   ├── dashboard/
│   │   ├── SummaryCard.tsx
│   │   ├── FinancialOverview.tsx
│   │   ├── IncomeExpenseChart.tsx
│   │   ├── GoalProgressChart.tsx
│   │   ├── RecentTransactions.tsx
│   │   ├── BudgetOverview.tsx
│   │   └── UpcomingPayments.tsx
│   │
│   ├── goals/
│   │   ├── GoalCard.tsx
│   │   ├── GoalForm.tsx
│   │   ├── GoalProgress.tsx
│   │   ├── GoalTable.tsx
│   │   └── GoalDetails.tsx
│   │
│   ├── transactions/
│   │   ├── TransactionTable.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionFilters.tsx
│   │   └── TransactionDetails.tsx
│   │
│   ├── budgets/
│   │   ├── BudgetCard.tsx
│   │   ├── BudgetForm.tsx
│   │   └── BudgetProgress.tsx
│   │
│   ├── reports/
│   │   ├── ReportFilters.tsx
│   │   ├── IncomeExpenseReport.tsx
│   │   ├── CategoryReport.tsx
│   │   └── FinancialSummary.tsx
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── MobileNavigation.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── PageContainer.tsx
│   │
│   └── notifications/
│       ├── NotificationBell.tsx
│       └── NotificationPanel.tsx
│
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   └── VerifyEmail.tsx
│   │
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Income.tsx
│   ├── Expenses.tsx
│   ├── Goals.tsx
│   ├── Budgets.tsx
│   ├── Accounts.tsx
│   ├── Categories.tsx
│   ├── RecurringTransactions.tsx
│   ├── Reports.tsx
│   ├── Calendar.tsx
│   ├── Notifications.tsx
│   ├── Profile.tsx
│   └── Settings.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useTransactions.ts
│   ├── useGoals.ts
│   ├── useBudgets.ts
│   ├── useAccounts.ts
│   ├── useCategories.ts
│   └── useNotifications.ts
│
├── services/
│   ├── supabase.ts
│   ├── authService.ts
│   ├── transactionService.ts
│   ├── goalService.ts
│   ├── budgetService.ts
│   ├── accountService.ts
│   └── reportService.ts
│
├── store/
│   ├── authStore.ts
│   ├── financeStore.ts
│   └── uiStore.ts
│
├── utils/
│   ├── currency.ts
│   ├── calculations.ts
│   ├── date.ts
│   ├── validators.ts
│   ├── export.ts
│   └── formatters.ts
│
├── types/
│   ├── auth.ts
│   ├── transaction.ts
│   ├── goal.ts
│   ├── budget.ts
│   ├── account.ts
│   └── category.ts
│
├── routes/
│   └── AppRoutes.tsx
│
├── constants/
│   ├── categories.ts
│   ├── currencies.ts
│   └── navigation.ts
│
├── App.tsx
├── main.tsx
└── index.css

Keep components small and reusable.

Never put the entire application inside one large component.

==================================================
3. AUTHENTICATION
==================================================

Create a complete authentication system.

Pages:

1. Login
2. Register
3. Forgot Password
4. Reset Password
5. Email Verification
6. Logout
7. Protected Routes

Registration fields:

- Full Name
- Email
- Password
- Confirm Password
- Currency
- Country
- Optional monthly income

Password requirements:
- Minimum 8 characters
- At least one uppercase
- At least one lowercase
- At least one number

Login:
- Email
- Password
- Remember me
- Forgot password
- Show/hide password
- Login loading state

Add:
- Google authentication if supported
- Email verification
- Session persistence

After successful login:
redirect to Dashboard.

Unauthenticated users must never access protected pages.

==================================================
4. APPLICATION LAYOUT
==================================================

Desktop:

Left sidebar navigation.

Top header.

Main content area.

Sidebar:

Logo:
"FINANCE OS"

Navigation:

Dashboard
Transactions
Income
Expenses
Goals
Budgets
Accounts
Recurring
Calendar
Reports

Secondary:

Categories
Notifications
Settings
Profile

Logout at bottom.

Sidebar must:
- Collapse
- Expand
- Animate smoothly
- Show tooltips when collapsed
- Persist collapsed state

Mobile:
Use bottom navigation or animated drawer.

Header:

Left:
Page title / breadcrumb

Right:
- Search
- Notifications
- Currency selector
- Theme toggle
- User avatar
- User menu

==================================================
5. DASHBOARD
==================================================

Create a premium financial dashboard inspired by the supplied screenshot.

Header:

FINANCE OS | FINANCIAL DASHBOARD

Show:
- Current date
- Current time
- Greeting
- User name

Example:

Good evening, Srinath 👋
Here's your financial overview.

Summary cards:

1. TOTAL BALANCE
2. TOTAL INCOME
3. TOTAL EXPENSES
4. SAVINGS
5. TOTAL GOALS
6. NET WORTH

Each card should include:
- Icon
- Label
- Amount
- Percentage change
- Comparison with previous month
- Small trend indicator

Example:

TOTAL BALANCE
₹6,42,500
+12.5%
vs last month

Use different visual colors:
Blue
Green
Orange
Purple
Red where appropriate.

==================================================
6. FINANCIAL OVERVIEW
==================================================

Create an interactive chart:

Income vs Expenses

Chart:
- Area chart
- Line chart
- Bar chart

User can switch:

7 Days
30 Days
3 Months
6 Months
1 Year

Display:
Income
Expenses
Savings

Hover tooltip must show:
Date
Income
Expense
Savings

Animate chart on load.

==================================================
7. SAVINGS OVERVIEW
==================================================

Create a savings card:

Monthly Savings

₹75,000

Savings Rate
32.5%

Progress indicator.

Include comparison with previous month.

==================================================
8. GOALS DASHBOARD
==================================================

Recreate the core concept of the provided image.

Section:

FINANCIAL GOALS

Summary cards:

Total Goals
Total Target
Total Saved
Total Remaining
Overall Progress

Example:

TOTAL GOALS
3 Active Goals

TOTAL TARGET
₹8,00,000

TOTAL SAVED
₹1,75,000

TOTAL REMAINING
₹6,25,000

OVERALL PROGRESS
21.88%

Create circular progress chart.

Create Goal Comparison chart:

Saved Amount
Remaining Amount

Goal examples:

Emergency Fund
Car Fund
Vacation Fund

Each goal should show:
- Goal icon
- Goal name
- Target amount
- Saved amount
- Remaining amount
- Progress percentage
- Target date
- Status

Example:

Emergency Fund
₹25,000 / ₹1,00,000
25%

Progress bar.

==================================================
9. GOALS CRUD
==================================================

User can:

CREATE
READ
UPDATE
DELETE

financial goals.

Create Goal fields:

Goal Name
Description
Target Amount
Initial Saved Amount
Target Date
Category
Icon
Color
Priority
Status

Statuses:

Active
Completed
Paused
Archived

Goal details page:

- Goal name
- Target amount
- Saved amount
- Remaining amount
- Progress
- Target date
- Days remaining
- Contribution history
- Add contribution button
- Edit
- Delete

Allow users to add money toward goals.

Example:

Add Contribution

Amount: ₹10,000
Date: 22 Sep 2026
Note: Monthly savings

Automatically update:
Saved amount
Remaining amount
Progress

==================================================
10. TRANSACTIONS
==================================================

Create a complete transaction management system.

Transaction types:

Income
Expense
Transfer

Fields:

Amount
Transaction Type
Category
Account
Date
Description
Notes
Payment Method
Tags
Attachment/Receipt
Recurring
Reference Number

CRUD:

Create
View
Edit
Delete

Transaction table:

Date
Description
Category
Account
Type
Amount
Status
Actions

Actions:
View
Edit
Duplicate
Delete

==================================================
11. TRANSACTION SEARCH/FILTER
==================================================

Add:

Search

Filter by:
- Date
- Category
- Account
- Type
- Amount range
- Payment method
- Tags

Sort:
Newest
Oldest
Highest amount
Lowest amount

Pagination.

Bulk selection.

Bulk delete.

Export selected transactions.

==================================================
12. INCOME MANAGEMENT
==================================================

Dedicated Income page.

Display:

Total Income
This Month
Last Month
Average Monthly Income

Income list.

Income sources:

Salary
Freelance
Business
Investment
Bonus
Other

Full CRUD.

Create Income modal.

Fields:

Amount
Source
Date
Account
Description
Recurring

==================================================
13. EXPENSE MANAGEMENT
==================================================

Dedicated Expenses page.

Summary:

Total Expenses
This Month
Daily Average
Largest Expense

Expense categories:

Food
Shopping
Transport
Rent
Bills
Entertainment
Healthcare
Education
Travel
Subscriptions
Insurance
Other

Full CRUD.

Create expense.

Edit expense.

Delete expense.

Expense analytics.

==================================================
14. BUDGET MANAGEMENT
==================================================

Allow users to create monthly budgets.

Example:

Food
Budget: ₹15,000
Spent: ₹11,500
Remaining: ₹3,500

Progress:

76.6%

Budget statuses:

Healthy
Warning
Exceeded

Set warning threshold.

Example:
Warning at 80%.

When spending exceeds budget:
show warning notification.

Budget page:

Total Budget
Total Spent
Remaining Budget
Budget Utilization

Category-wise budget chart.

==================================================
15. ACCOUNTS
==================================================

Allow users to manage financial accounts.

Account types:

Cash
Bank Account
Savings Account
Credit Card
Wallet
Investment
Other

Fields:

Account Name
Account Type
Bank Name
Account Number (masked)
Opening Balance
Current Balance
Currency
Description

CRUD.

Account details:

Balance
Income
Expenses
Transactions
Monthly activity

Never display sensitive account numbers fully.

==================================================
16. CATEGORIES
==================================================

User can manage categories.

Default categories should be available.

Allow:

Create
Edit
Delete
Archive

Each category has:

Name
Icon
Color
Type

Type:

Income
Expense
Both

==================================================
17. RECURRING TRANSACTIONS
==================================================

Add recurring financial records.

Examples:

Salary
Rent
Netflix
Insurance
Loan EMI
Internet
Subscriptions

Fields:

Name
Amount
Type
Category
Account
Frequency
Start Date
End Date
Next Due Date

Frequency:

Daily
Weekly
Monthly
Quarterly
Yearly

Automatically show upcoming transactions.

==================================================
18. CALENDAR
==================================================

Create financial calendar.

Show:

Income dates
Expense dates
Bill due dates
Goal contributions
Recurring payments

Clicking a date should show all financial activity.

Use different visual indicators for:
Income
Expense
Bills
Goals

==================================================
19. REPORTS
==================================================

Create a professional reports section.

Reports:

Income Report
Expense Report
Savings Report
Goal Report
Budget Report
Net Worth Report
Category Report

Filters:

Today
This Week
This Month
Last Month
3 Months
6 Months
This Year
Custom Range

Charts:

Pie chart
Donut chart
Bar chart
Area chart
Line chart

==================================================
20. NET WORTH
==================================================

Create Net Worth tracking.

Net Worth:

Assets - Liabilities

Assets:
Cash
Bank
Savings
Investments
Property
Other

Liabilities:
Credit Card
Loans
EMI
Other Debt

Show:

Current Net Worth
Previous Month
Change
Net Worth History

Graph:

Net Worth over time.

==================================================
21. FINANCIAL HEALTH
==================================================

Add a Financial Health section.

Calculate indicators such as:

Savings Rate
Expense Ratio
Budget Utilization
Emergency Fund Progress
Debt-to-Income Ratio

Do not present these as professional financial advice.

Show them as informational metrics based solely on the user's entered data.

Use visual indicators.

Example:

Savings Rate
32%

Emergency Fund
65%

Budget Usage
72%

==================================================
22. NOTIFICATIONS
==================================================

Notification center.

Notifications:

Budget exceeded
Budget near limit
Upcoming bill
Goal deadline approaching
Goal completed
Recurring payment due
Large expense
Monthly summary

Unread count badge.

Mark as read.

Mark all as read.

Delete notification.

==================================================
23. SEARCH
==================================================

Global search.

Search:

Transactions
Goals
Budgets
Accounts
Categories

Keyboard shortcut:

Ctrl + K

Create a command palette.

Example:

Search transactions...

Emergency Fund
Amazon
Salary
Car Fund

==================================================
24. EXPORT
==================================================

Allow users to export data.

Formats:

CSV
Excel
PDF

Export:

Transactions
Goals
Budgets
Reports

Provide date filters before exporting.

==================================================
25. IMPORT
==================================================

Allow CSV import.

User uploads CSV.

Show preview.

Validate columns.

Display errors.

Allow mapping:

Date
Description
Amount
Category
Type
Account

Then import.

Show import summary:

Imported
Skipped
Failed

==================================================
26. PROFILE
==================================================

Profile page.

Fields:

Profile photo
Full Name
Email
Phone
Country
Currency
Timezone

Change password.

Update profile.

Delete account.

==================================================
27. SETTINGS
==================================================

Settings sections:

Appearance
Currency
Notifications
Security
Data
Privacy

Appearance:

Light
Dark
System

Currency:

INR
USD
EUR
GBP
AED
etc.

Date format.

Number format.

Timezone.

Notification preferences.

==================================================
28. DARK MODE
==================================================

Create a beautiful dark mode.

Light mode:

White background
Soft gray
Navy
Blue
Green
Orange
Purple

Dark mode:

Deep navy/black background
Dark cards
Readable borders
Subtle gradients

Ensure every component works correctly in both modes.

==================================================
29. UI DESIGN
==================================================

Design language:

Modern fintech SaaS.

Use:

- Rounded cards
- Soft shadows
- Subtle borders
- Glass effects where appropriate
- Smooth gradients
- Professional typography
- Clear hierarchy
- Consistent spacing
- Large readable financial numbers

Primary colors:

Navy:
#071A3D

Blue:
#2563EB

Green:
#16A34A

Orange:
#F59E0B

Purple:
#7C3AED

Red:
#DC2626

Do not overuse colors.

Colors should communicate financial states.

==================================================
30. DASHBOARD CARD DESIGN
==================================================

Cards should contain:

Icon container
Title
Value
Percentage
Trend
Optional mini chart

Example:

┌──────────────────────────────┐
│ 💰 TOTAL BALANCE             │
│                              │
│ ₹6,42,500                    │
│                              │
│ ↑ 12.5%  vs last month       │
└──────────────────────────────┘

Cards should animate slightly when hovered.

==================================================
31. ANIMATIONS
==================================================

Use Framer Motion.

Animations must be professional and subtle.

Page transitions:
fade + slide

Cards:
fade-up on load

Charts:
animated rendering

Numbers:
count-up animation

Progress bars:
animated width

Modals:
scale + fade

Sidebar:
slide

Dropdown:
fade + scale

Toast:
slide from right

Do not over-animate.

Animation should never hurt usability.

==================================================
32. LOADING STATES
==================================================

Every page must have skeleton loading.

Do not show blank white screens.

Examples:

Dashboard skeleton
Table skeleton
Card skeleton
Chart skeleton

Buttons should show loading state.

Example:

Saving...

Deleting...

Updating...

==================================================
33. EMPTY STATES
==================================================

If no transactions:

"No transactions yet"

"Start tracking your income and expenses."

Button:

+ Add Transaction

If no goals:

"No financial goals yet"

"Create your first savings goal."

==================================================
34. ERROR HANDLING
==================================================

Handle:

Network errors
Supabase errors
Authentication errors
Validation errors
Duplicate records
Invalid amounts
Invalid dates

Show friendly messages.

Never expose raw database errors to users.

==================================================
35. DELETE CONFIRMATION
==================================================

Never immediately delete important financial records.

Use confirmation modal.

Example:

Delete Transaction?

This transaction will be permanently removed.

Cancel
Delete

For goals/accounts/categories:
also require confirmation.

==================================================
36. TOAST SYSTEM
==================================================

Show toast messages:

Transaction added successfully
Transaction updated successfully
Transaction deleted successfully
Goal created successfully
Goal updated successfully
Budget created successfully

Errors:

Unable to save transaction.
Please try again.

==================================================
37. RESPONSIVE DESIGN
==================================================

Desktop:
Optimized for 1440px and above.

Laptop:
1280px

Tablet:
768px

Mobile:
320px+

Dashboard should automatically transform.

Desktop:
multi-column cards

Tablet:
2-column cards

Mobile:
1-column cards

Tables:
horizontal scrolling or responsive cards.

Sidebar:
Desktop sidebar
Mobile drawer/bottom navigation.

Charts must resize automatically.

==================================================
38. DATA CALCULATIONS
==================================================

Implement all calculations dynamically.

Total Income:

SUM(all income)

Total Expenses:

SUM(all expenses)

Balance:

Total Income - Total Expenses

Savings:

Income - Expenses

Savings Rate:

Savings / Income * 100

Goal Remaining:

Target - Saved

Goal Progress:

Saved / Target * 100

Budget Remaining:

Budget - Spent

Budget Usage:

Spent / Budget * 100

Net Worth:

Assets - Liabilities

All calculations must update immediately after CRUD operations.

Never hardcode dashboard values.

==================================================
39. DATABASE STRUCTURE
==================================================

Create Supabase tables:

profiles

columns:
id
user_id
full_name
email
avatar_url
currency
country
timezone
created_at
updated_at

accounts

id
user_id
name
type
bank_name
masked_number
opening_balance
current_balance
currency
description
created_at
updated_at

categories

id
user_id
name
type
icon
color
is_default
created_at
updated_at

transactions

id
user_id
account_id
category_id
type
amount
description
notes
transaction_date
payment_method
reference
is_recurring
created_at
updated_at

goals

id
user_id
name
description
target_amount
saved_amount
target_date
category
icon
color
priority
status
created_at
updated_at

goal_contributions

id
goal_id
user_id
amount
contribution_date
note
created_at

budgets

id
user_id
category_id
amount
month
year
warning_threshold
created_at
updated_at

recurring_transactions

id
user_id
account_id
category_id
name
amount
type
frequency
start_date
end_date
next_due_date
active
created_at
updated_at

notifications

id
user_id
title
message
type
is_read
created_at

assets

id
user_id
name
type
value
description
created_at
updated_at

liabilities

id
user_id
name
type
amount
description
created_at
updated_at

==================================================
40. DATABASE SECURITY
==================================================

Use Supabase Row Level Security.

Every table containing user information must have policies:

SELECT:
user can access own records

INSERT:
user can insert own records

UPDATE:
user can update own records

DELETE:
user can delete own records

Never allow one user to access another user's financial information.

==================================================
41. DASHBOARD QUICK ACTIONS
==================================================

Add floating/quick action button:

+

Options:

Add Income
Add Expense
Add Transaction
Create Goal
Add Budget
Add Account

Use animated menu.

==================================================
42. QUICK ADD TRANSACTION
==================================================

Allow quick transaction entry directly from dashboard.

Modal:

Expense / Income toggle

Amount

Category

Account

Date

Description

Save

Keep it very fast.

==================================================
43. RECENT TRANSACTIONS
==================================================

Dashboard should show latest 5-10 transactions.

Example:

Amazon
Shopping
-₹2,500

Salary
Income
+₹85,000

Electricity
Bills
-₹3,200

View All button.

==================================================
44. UPCOMING PAYMENTS
==================================================

Dashboard section:

Upcoming Payments

Netflix
₹649
Tomorrow

Rent
₹18,000
5 days

Insurance
₹12,500
12 days

Show:
- Date
- Amount
- Category
- Account

==================================================
45. FINANCIAL INSIGHTS
==================================================

Add an "Insights" section.

Generate insights from user's actual data.

Examples:

"You spent 18% less on food this month."

"Your savings rate increased from 24% to 31%."

"Your Car Fund is 20% complete."

"You are approaching your Shopping budget."

Insights must be based on actual stored data.

Do not fabricate financial data.

==================================================
46. MONTHLY SUMMARY
==================================================

At the end of every month display:

Monthly Financial Summary

Income
Expenses
Savings
Savings Rate
Top Expense Category
Largest Transaction
Goals Progress

Include charts.

Allow export as PDF.

==================================================
47. ACCESSIBILITY
==================================================

Follow accessibility best practices.

Use:

ARIA labels
Keyboard navigation
Visible focus states
Proper heading hierarchy
Accessible modals
Accessible buttons
Accessible form labels

Do not rely only on color.

==================================================
48. PERFORMANCE
==================================================

Optimize the application.

Use:

Lazy loading
Code splitting
Memoization where necessary
Pagination
Debounced search
Optimized Supabase queries

Do not load thousands of transactions at once.

==================================================
49. SECURITY
==================================================

Never store passwords manually.

Use Supabase Auth.

Never expose service role keys in frontend.

Use environment variables:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

Never commit secrets.

==================================================
50. UX REQUIREMENTS
==================================================

The application should feel like a professional financial SaaS product.

User should be able to perform common actions within 1-2 clicks.

For example:

Dashboard → Add Expense → Amount → Category → Save

Dashboard → Create Goal → Target → Date → Save

Transactions → Search → Edit → Save

Goals → Add Contribution → Amount → Save

==================================================
51. TABLE UX
==================================================

Tables must support:

Search
Filter
Sort
Pagination
Column alignment
Responsive layout
Row hover
Actions menu

Actions menu:

View
Edit
Duplicate
Delete

Use dropdown menus rather than cluttering every row with many buttons.

==================================================
52. FORM UX
==================================================

All forms should have:

Labels
Placeholders
Validation
Error messages
Helper text
Required indicators

Example:

Amount *

₹ 0.00

"Enter an amount greater than 0."

Do not rely only on placeholder text.

==================================================
53. CURRENCY
==================================================

Default currency:

INR

Format:

₹1,75,000

Support:

INR
USD
EUR
GBP
AED
AUD
CAD

Create centralized currency formatter.

Do not hardcode ₹ throughout components.

==================================================
54. SAMPLE DATA
==================================================

Provide realistic demo data for development.

Example goals:

Emergency Fund
Target ₹1,00,000
Saved ₹25,000

Car Fund
Target ₹5,00,000
Saved ₹1,00,000

Vacation Fund
Target ₹2,00,000
Saved ₹50,000

But clearly separate seed/demo data from actual user data.

==================================================
55. DASHBOARD LAYOUT
==================================================

Desktop dashboard:

HEADER

Greeting + Date + Notifications

SUMMARY CARDS

[Balance]
[Income]
[Expenses]
[Savings]
[Goals]

MAIN ANALYTICS

[Income vs Expenses Chart] [Savings Overview]

GOALS

[Goal Progress] [Goal Comparison]

FINANCIAL ACTIVITY

[Recent Transactions] [Upcoming Payments]

BUDGET

[Budget Overview]

INSIGHTS

[Financial Insights]

FOOTER

==================================================
56. LOGIN UI
==================================================

Create a premium login screen.

Left side:
Finance illustration / gradient / abstract financial graphics.

Right side:
Login form.

Logo:

FINANCE OS

Heading:

Welcome Back

Subtitle:

Take control of your money and build your financial future.

Inputs:

Email
Password

Remember me
Forgot password?

Button:

Sign In

Divider:

OR

Continue with Google

Bottom:

Don't have an account?
Create Account

==================================================
57. REGISTER UI
==================================================

Heading:

Create Your Account

Subtitle:

Start managing your finances smarter.

Fields:

Full Name
Email
Password
Confirm Password
Currency

Create Account button.

Terms checkbox.

Link to Login.

==================================================
58. PROFILE AVATAR
==================================================

Allow user to:

Upload profile photo
Remove photo
Change photo

Use Supabase Storage.

Show avatar throughout application.

==================================================
59. DARK/LIGHT THEME
==================================================

Theme should persist after reload.

Use:

localStorage

Theme options:

Light
Dark
System

==================================================
60. MOBILE EXPERIENCE
==================================================

Mobile must not simply shrink desktop UI.

Create a dedicated mobile-friendly layout.

Bottom navigation:

Home
Transactions
Goals
Reports
More

Floating "+" button.

Mobile cards should be swipe-friendly.

Tables can transform into transaction cards.

==================================================
61. CONFIRMATION OF DATA
==================================================

After important actions:

Show success toast.

Example:

✓ Goal created successfully

Use icons.

==================================================
62. CODE QUALITY
==================================================

Important:

Do not duplicate logic.

Do not put business calculations directly inside JSX.

Put calculations into:

utils/calculations.ts

Put formatting into:

utils/formatters.ts

Put API/database operations into services.

Put reusable state into hooks.

Use TypeScript interfaces/types.

Avoid:

any

where possible.

Use strict TypeScript.

==================================================
63. COMPONENT REUSABILITY
==================================================

Create reusable components:

FinancialCard
ProgressBar
CurrencyDisplay
PercentageDisplay
DataTable
Modal
ConfirmDialog
FormField
SelectField
DateField
EmptyState
LoadingState
PageHeader
StatCard
ChartCard

These should be reusable across the application.

==================================================
64. ROUTING
==================================================

Use React Router.

Routes:

/login
/register
/forgot-password

/dashboard
/transactions
/income
/expenses
/goals
/goals/:id
/budgets
/accounts
/accounts/:id
/categories
/recurring
/calendar
/reports
/notifications
/profile
/settings

Protect all application routes.

==================================================
65. ERROR PAGE
==================================================

Create:

404 page

500/error page

Include:

Illustration
Message
Back to Dashboard button

==================================================
66. FINAL UI QUALITY
==================================================

The final application must look like a modern SaaS product comparable to professional fintech dashboards.

Avoid:

- Generic Bootstrap-looking UI
- Excessive gradients
- Excessive shadows
- Huge empty spaces
- Tiny text
- Inconsistent buttons
- Random colors
- Unnecessary animations
- Hardcoded data
- Static charts
- Fake CRUD

Everything should feel connected and intentional.

==================================================
67. IMPORTANT FUNCTIONAL REQUIREMENT
==================================================

When a user creates, updates or deletes:

Transaction

Goal

Goal Contribution

Budget

Account

Category

Recurring Transaction

Income

Expense

Asset

Liability

the dashboard and all related calculations must update automatically.

For example:

Adding ₹10,000 income should update:

Total Income
Balance
Savings
Savings Rate
Charts
Reports
Recent Transactions

Adding ₹5,000 expense should update:

Total Expenses
Balance
Savings
Category spending
Budget
Charts
Reports

Adding ₹10,000 to a goal should update:

Goal Saved
Goal Remaining
Goal Progress
Overall Goal Progress
Dashboard Goal Summary

==================================================
68. FINANCIAL DATA VISUALIZATION
==================================================

Use Recharts.

Charts should include:

LineChart
AreaChart
BarChart
PieChart
RadialBarChart

Charts should have:

ResponsiveContainer
Tooltip
Legend
Animation
Proper currency formatting
Empty states

==================================================
69. FINAL DELIVERABLE
==================================================

Generate the complete project.

Include:

package.json

.env.example

README.md

Supabase SQL schema

RLS policies

Seed/demo data

All React components

All pages

All routes

All hooks

All services

All types

All utilities

All styling

Authentication

CRUD

Charts

Reports

Export

Import

Responsive design

Dark mode

Animations

Loading states

Error states

Empty states

Toast notifications

Confirmation dialogs

Do not leave placeholder components.

Do not write:

"implement later"

"TODO"

"coming soon"

or fake buttons.

Every visible button should perform its intended action.

==================================================
70. README
==================================================

README must explain:

1. Project overview
2. Technology stack
3. Installation
4. Environment variables
5. Supabase setup
6. Database setup
7. Authentication setup
8. Running locally
9. Building production
10. Folder structure
11. How to add a new page
12. How to add a new database entity
13. How to add a new chart
14. How to customize colors
15. How to customize currency
16. How to deploy

==================================================
71. DEVELOPMENT PRINCIPLE
==================================================

Make the project extremely easy to modify.

If I want to change:

Dashboard card

Chart

Color

Sidebar item

Database table

Form field

Goal calculation

Currency

Theme

Navigation

I should be able to find the relevant file immediately.

Keep concerns separated.

Use clear naming.

Avoid giant files.

==================================================
72. FINAL VISUAL DIRECTION
==================================================

The application should visually combine:

Professional fintech dashboard
+
Modern SaaS interface
+
Clean financial analytics
+
Goal tracking
+
Personal finance management

Use the supplied image as inspiration specifically for:

- Header structure
- Financial summary cards
- Goal progress section
- Circular progress
- Goal comparison chart
- Individual goal progress
- Financial table
- Color semantics

But improve the design with:

- Better spacing
- Better responsive behavior
- Better typography
- Modern icons
- Interactive charts
- Smooth animations
- Better navigation
- Dark mode
- Mobile optimization
- Modern modals
- Better forms
- Search
- Filters
- Notifications
- Insights
- Financial analytics

==================================================
73. STARTING SCREEN
==================================================

When the user logs in, show:

Header:

Good Evening, [Name] 👋
Here's your financial overview.

Current date.

Summary cards.

Then:

Financial Overview

Income vs Expenses

Then:

Goals Progress

Then:

Recent Transactions

Then:

Budget Overview

Then:

Upcoming Payments

Then:

Financial Insights

Make the dashboard visually balanced and information-dense without feeling crowded.

==================================================
74. DO NOT USE STATIC HARDCODED DASHBOARD
==================================================

This is extremely important.

Do NOT make dashboard numbers manually written into JSX.

Bad:

₹8,00,000

Good:

calculateTotalGoalTarget(goals)

Bad:

21.88%

Good:

calculateOverallGoalProgress(goals)

Every number should come from database state.

==================================================
75. IMPLEMENTATION ORDER
==================================================

Build in this order:

1. Project setup
2. Tailwind/theme
3. Supabase connection
4. Authentication
5. Database schema
6. Layout
7. Sidebar
8. Header
9. Dashboard
10. Transactions
11. Income
12. Expenses
13. Goals
14. Budgets
15. Accounts
16. Categories
17. Recurring transactions
18. Calendar
19. Reports
20. Notifications
21. Profile
22. Settings
23. Import/export
24. Responsive optimization
25. Dark mode
26. Animations
27. Error handling
28. Final UI polish

After implementation, verify every route and CRUD operation.

==================================================
76. FINAL ACCEPTANCE CRITERIA
==================================================

The application is complete only if:

✓ Registration works
✓ Login works
✓ Logout works
✓ Password reset works
✓ Protected routes work
✓ Dashboard works
✓ Transactions CRUD works
✓ Income CRUD works
✓ Expenses CRUD works
✓ Goals CRUD works
✓ Goal contributions work
✓ Budgets CRUD works
✓ Accounts CRUD works
✓ Categories CRUD works
✓ Recurring transactions work
✓ Reports work
✓ Charts are dynamic
✓ Calculations are dynamic
✓ Search works
✓ Filters work
✓ Sorting works
✓ Pagination works
✓ Notifications work
✓ Dark mode works
✓ Responsive mobile UI works
✓ Export works
✓ Import works
✓ Loading states work
✓ Empty states work
✓ Error states work
✓ Confirmation dialogs work
✓ Toast messages work
✓ Supabase RLS is implemented
✓ No sensitive data is exposed
✓ No hardcoded financial totals
✓ No fake buttons
✓ No TODO placeholders

Build the application as a real, maintainable, production-ready Finance Management SaaS application.