🏏 CrickCast – Live Cricket Commentary Simulation

CrickCast is a React (or React Native) app that simulates real-time cricket commentary.
It updates dynamically based on events (runs, boundaries, wickets, overs) and provides engaging, broadcast-style commentary.

🚀 Features

🎙 Dynamic Commentary Engine

Dot balls, singles, boundaries, sixes, and wickets generate contextual, varied commentary.

Multiple templates ensure commentary feels real and engaging, not robotic.

👨‍💻 Event-driven Updates

Uses an event system to handle match updates.

Each event updates only what’s required (avoiding unnecessary re-renders).

🔄 Local Event Simulator (Simulation Mode)

Commentary can be fed via simulated (no backend required).

Mimics how live feeds update in real broadcast apps.

🏏 Teams & Players

Hardcoded sample teams (India, Pakistan, etc.) with batting order, bowlers, all-rounders.

Commentary inserts player names dynamically for realism.

📱 Optimized Rendering

Prevents full component re-renders on every event → only commentary area updates.

Improves performance on large event streams.

💡 Resilience for Unknown Events

If an unknown/unexpected event type occurs, the app logs it gracefully and falls back to a safe message (e.g., "Unknown event occurred").

Prevents crashes during runtime.

🛠 Tech Stack

React / React Native – Frontend framework.

JavaScript (ES6+) – Core language.

Socket Simulation – For streaming commentary updates.

CSS-in-JS / Inline Styling – For simple, portable UI styling.





