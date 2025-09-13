

📝 Expanded Approach for CrickCast

CrickCast is built to run on both iOS and Android using React Native. It simulates a live T20 cricket match commentary feed, dynamically updating the UI as new events occur. The key to the design was to create a responsive, engaging, and resilient interface that behaves like a real broadcast commentary system.

1. Event-Driven Architecture

We created a mock data generator function that simulates a real-time event stream.

Events such as BALL, BOUNDARY, SIX, WICKET, and MATCH_STATUS are pushed periodically into the app.

Each event triggers only the relevant components to update, avoiding unnecessary re-renders and keeping the UI smooth.

2. Dynamic UI for Different Event Types

BALL events are displayed in a neutral style.

BOUNDARY and SIX are visually emphasized with bright colors and subtle animations.

WICKET events trigger vibration feedback and red highlights to grab attention.

MATCH_STATUS events can alter the context of the screen, showing summaries like “Innings Break” or “Team Score.”

This ensures the user can instantly interpret the importance of each event at a glance.

3. Handling Unknown Event Types

For events the app hasn’t been explicitly designed for, a safe fallback mechanism is used:

The event is logged for debugging purposes.

A default message like "Unknown event occurred" is displayed.

The app does not crash, maintaining stability throughout the match.

4. Score Aggregation & Player Tracking

Runs, wickets, and overs are dynamically calculated from the event stream.

Optional enhancements include tracking individual player runs, balls faced, and strike rates.

5. Animations & Engagement

New events slide in with fade and translate animations.

High-impact events like wickets or sixes trigger visual and haptic feedback.

FlatList + memoized components ensure efficient rendering for long feeds.

6. Cross-Platform Compatibility

Fully compatible with iOS and Android.

Uses React Native’s SafeAreaView, Dimensions, and responsive styling to adapt across devices.

Local mock data ensures the app can run without any backend, making it easy to demo.

7. Resilience & Extensibility

The architecture is future-ready for live WebSocket integration.

New event types can be added easily without breaking existing functionality.

The mock data generator can be swapped for a real live feed seamlessly.

Key Problems Solved

Dynamic UI handling: Every event type has its own visual emphasis, and MATCH_STATUS events update context.

Unknown events: The app handles unexpected event types gracefully, logging them and displaying a safe message, preventing crashes.
