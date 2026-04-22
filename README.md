# 📚 Daily Study Goals App (오늘의 공부 목표)

<div align="center">
  <p>A cute, modern, and interactive daily planner designed to keep your motivation high! 🌱</p>
</div>

## ✨ Features

*   **✨ Interactive Progress Tracking:** Don't just check a box! Use the custom range sliders to track precisely how far along you are (0% to 100%) for each goal.
*   **🌤️ Smart Weather Widget:** Displays real-time time, date, and local weather via the `wttr.in` API. You can automatically detect your location or switch between major Korean cities (Seoul, Busan, Jeju, etc.).
*   **🎨 Pastel UI & Animations:** Beautifully crafted using a mint-green vibrant palette (`#4CAF93`). Includes bouncing emojis, fluid strikethrough logic, and dynamic pastel backgrounds for completed tasks.
*   **💡 Daily Motivational Quotes:** Get a random, inspiring Korean quote every time you open the app to boost your study morale!
*   **💾 Local Storage Persistence:** All your goals, completion states, and progress percentages are securely saved in your browser's Local Storage.
*   **🗑️ Safe Deletion:** Inline, non-intrusive deletion confirmations ensure you never accidentally delete a task without interrupting your workflow. Includes a bulk "Clear Completed" function.

## 🛠️ Tech Stack

*   **Frontend Framework:** React 19 + TypeScript
*   **Build Tool:** Vite
*   **Styling & Design:** Tailwind CSS v4
*   **Animations:** `motion` (Framer Motion)
*   **Icons:** Lucide React
*   **APIs:** `wttr.in` (No API Key required)

## 🚀 Quick Start

To run this project locally, simply follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/daily-study-goals.git
cd daily-study-goals
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:3000` to see the app in action!

## 💡 How to Use

1.  **Add a Goal:** Type your study goal in the input field and hit "Enter" or click the `+` button. (Empty inputs will trigger a warning shake!).
2.  **Update Progress:** Drag the slider beneath your goal to track your progress. Once it hits 100%, it will automatically be crossed off.
3.  **Quick Complete:** Click the checkbox to instantly toggle between 0% and 100%.
4.  **Weather Settings:** Click the dropdown in the top weather widget to check the weather in different regions.
5.  **Clear Board:** Once you have completed tasks, scroll to the bottom and click the pink "완료된 항목 모두 삭제 ✨" button to archive them out of sight.

---
*Built with ❤️ for better study habits.*
