# ⚡ LearnoHub AI

**LearnoHub AI** is an interactive, responsive web-based learning platform for Artificial Intelligence and Machine Learning. The application offers a structured learning path with real-time feedback quizzes, right in your browser!

![LearnoHub AI Overview](https://img.shields.io/badge/Status-Active-success) ![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-blue)

---

## 🌟 Key Features

1. **User Authentication System**
   - Seamless login and registration handled securely via the browser’s `localStorage`.
   - Dedicated user profiles that safely segregate and track individual progress locally without needing a backend server!
   - Proper validation checking for email syntax and password matching.
   
2. **Structured Learning Modules**
   - Three dedicated learning modules built to ease students into the AI world:
     - **Beginner**: *What is AI?* & *Machine Learning 101*
     - **Intermediate**: *Neural Networks*
     - **Advanced**: *AI in the Real World*
   - Clear explanations paired directly with real-world examples and interactive reading cards.

3. **Built-in Quizzes & Assessments**
   - Each module difficulty contains a 5-question Multiple Choice Quiz to test knowledge.
   - Beautiful visual feedback alerts you instantly if your chosen answer is correct or incorrect.
   - At the end of the quiz, see your final score and automatically push your highest score back to your profile!

4. **Progress Tracking Dashboard**
   - A personalized dashboard rendering the active user's stats dynamically.
   - Visually tracks modules completed out of the total available.
   - Shows a live breakdown of quiz scores for each individual module.
   - Calculates overall mastery via a dedicated mathematical progress bar.

5. **Python Playground (Pyodide)**
   - Run Python code natively in your browser with zero installations needed! Type Python directly into the web editor and instantly evaluate the output.

6. **Interactive AI Simulations**
   - **Spam Classifier**: Test an introductory text-parsing algorithm that classifies your custom sentences as "Safe" or "Spam".
   - **Term Matcher Game**: A high-paced drag-and-drop matching game built to cement terminology definitions under a strict timer.

---

## 🛠️ Technology Stack

This application is built entirely as a **Frontend-only Single Page Application (SPA)**:
- **HTML5**: Semantic web structuring.
- **Vanilla CSS**: Custom sleek styling, engaging CSS keyframe animations, and highly responsive sizing across mobile and desktop.
- **Vanilla JavaScript (ES6)**: State management, SPA routing, quiz logic matrices, and local database handling via `localStorage`.

---

## 💻 How to Run Locally

Because LearnoHub AI is completely frontend-based and utilizes local browser memory, it is incredibly easy to run!

1. Clone or download this repository to your local machine.
2. Navigate into the `frontend` folder.
3. Once inside the folder, simply **double-click the `index.html` file** to open it natively in your default internet browser (Chrome, Firefox, Safari, Edge).
4. No installations, package managers, or `npm` commands are required!

*(Note: Certain advanced web browser strict security settings restrict JavaScript when running natively from `file://`. If you experience issues, use a lightweight local server proxy like VS Code's "Live Server" extension).*

---

## 🚀 Usage Guide

1. Open the app and click exactly on the top right **Login** button.
2. At the pop-up, you can either sign in to an existing account you made or toggle over to **Create Account** to register a new mock user.
3. Upon login, your name will lock into the **Dashboard**. From there, you can view your progress.
4. Navigate to the **Learn** tab, pick a module, read the pages, and click **Next** to gain XP and mark it as completed.
5. Head over to the **Quiz** tab and test your knowledge. Completing the quiz will automatically update your overall dashboard completion metrics!
