# 🏅 Live Sports Meet Scoreboard

A **real-time scoreboard** for school sports meet events, built with **Next.js**, **Tailwind CSS**, and **TypeScript**, using **Server-Sent Events (SSE)** for live updates.

---

## ⚡ Features

- Real-time score updates for multiple houses using **Server-Sent Events (SSE)**  
- Google authentication for secure admin access  
- Admin controls to **add points**, **reset scores**, and **manage events**  
- Responsive and clean UI powered by **Tailwind CSS**  
- Score persistence (requires remote storage for production)  

---

## 🛠️ Tech Stack

- **Next.js** – React framework with server-side rendering & API routes  
- **React** – Frontend library for building UI components  
- **Tailwind CSS** – Utility-first CSS for rapid styling  
- **TypeScript** – Static typing for safer, scalable code  

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VikumKarunathilake/ScoreBoard.git
   cd ScoreBoard
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the project root:

   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ADMIN_EMAILS=your_email@example.com, another_email@example.com
   ```

4. **Run the development server**:

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your scoreboard.

---

## 🔑 Admin Access

To access admin controls:

1. Sign in with a **Google account** listed in `ADMIN_EMAILS`.
2. Admin controls appear on the homepage:

   * Add points to houses
   * Reset all scores
   * Monitor live event updates


## ⚠️ Important Deployment Note

> **This project cannot be deployed as-is in a pure serverless environment if using local file storage (`scores.json`).**

* The current implementation writes scores to a local file (`/data/scores.json`).
* Serverless platforms like **Vercel Serverless Functions** or **Fastly Compute@Edge** **do not allow persistent filesystem writes**, so scores will be lost on each invocation.


## 📚 Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Learn Next.js](https://nextjs.org/learn)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)