# Finance Dashboard

This is a comprehensive finance dashboard application built with modern web
technologies.

## Project Overview

### What I Built & Design Choices

I developed a streamlined **Personal Finance Dashboard** that allows users to
track their financial health in real-time. The application enables users to log
transactions (income/expenses), monitor monthly budgets by category, and
visualize spending patterns through interactive charts.

**Key Technical Decisions:**

- **Vite:** Selected for its lightning-fast build times and Hot Module
  Replacement (HMR), ensuring a seamless development workflow.
- **React:** Utilized effectively for its component-based architecture, allowing
  for the isolation of complex UI elements like charts and forms.
- **TypeScript:** Implemented to enforce strict type safety, which is critical
  for financial applications to prevent calculation errors and ensure data
  integrity.
- **Tailwind CSS:** Chosen for its utility-first approach, enabling rapid
  implementation of a responsive, grid-based layout that adapts gracefully from
  desktop to mobile.
- **shadcn/ui:** Integrated to provide accessible, high-quality UI primitives,
  ensuring the application feels professional and polished without reinventing
  the wheel.

### What I’d Improve With More Time

- **Data Persistence:** Integrate a backend solution (like Supabase or Firebase
  or NestJS with PostgresSQL) to persist user data across sessions and devices.
- **Advanced Analytics:** Implement custom date ranges and year-over-year
  comparison views for deeper financial insights.
- **Testing:** Add comprehensive unit tests (using Vitest) for the core
  financial calculation logic in `lib/finance.ts`.
- **Reference Improvements:** Enhance accessibility compliance (WCAG) across all
  dynamic components, particularly the charts.

### Challenges Faced

One of the main challenges was managing the **state synchronization** between
the transaction history and the aggregated budget data. I addressed this by
leveraging React's `useMemo` to efficiently recalculate derived statistics (like
monthly totals and category breakdowns) only when the underlying transaction
data changed. This ensured the dashboard remained performant even as more data
was added, preventing unnecessary re-renders.

### Time Spent

**Total:** ~1 Day

- **Planning & Architecture:** 2 hours
- **Development (Logic & Components):** 5 hours
- **Styling & Refinement:** 3 hours
- **Deployment & Documentation:** 2 hours

## Tech Stack

- **Framework:** [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository: git clone
   <https://github.com/Onyedikachi123/finance-tracker.git> cd finance-tracker

2. Install dependencies: npm install

3. Start the development server: npm run dev

## Development

The application is structured using modern React patterns.

- `src/components`: Reusable UI components
- `src/pages`: Application views/routes
- `src/lib`: Utilities and helpers

## Building for Production

To create a production build:

```bash
npm run build
```

The artifacts will be in the `dist` directory.
