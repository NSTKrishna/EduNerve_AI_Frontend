# EduNerve AI Frontend

Welcome to the frontend repository for **EduNerve AI**, an intelligent, AI-powered educational platform designed to enhance the learning experience. This repository contains a modern React application built with Vite, featuring interactive dashboards, quizzes, and mock interview practice.

## 🚀 Features

- **Interactive Dashboard:** Track learning progress with intuitive charts (powered by Recharts).
- **AI-Powered Assessments:**
  - **Quiz Hub:** Take dynamic quizzes and review detailed results.
  - **Interview Practice:** Participate in mock interviews with AI feedback (powered by Vapi AI).
- **Authentication:** Secure user login and signup, including Google OAuth integration.
- **Responsive UI:** Modern, accessible, and responsive styling built with Tailwind CSS and Radix UI components.
- **Smooth Animations:** Engaging user interfaces using Framer Motion.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) (Icons)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Auth:** [React Google OAuth](https://github.com/MomenSherif/react-oauth)

## 📁 Project Structure

```text
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
│   ├── common/      # Generic buttons, inputs, badges, etc.
│   ├── dashboard/   # Dashboard specific widgets (Stats, Cards)
│   ├── layout/      # Navbar, Sidebar, Page Layouts
│   ├── quiz/        # Quiz taking and result views
│   └── ui/          # Core component primitives (shadcn-like)
├── context/         # React Context for state management
├── data/            # Mock data and structural content
├── lib/             # Utility functions and API clients
└── pages/           # Main route components (Home, Login, Dashboard, etc.)
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/NSTKrishna/EduNerve_AI_Frontend.git
   cd EduNerve_AI_Frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your required environment variables (e.g., Google OAuth App ID, Vapi API keys, backend API URLs).

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Build for production:**

   ```bash
   npm run build
   ```

## 📜 Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Bundles the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality issues.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
