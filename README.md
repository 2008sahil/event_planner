Here is the content in markdown format that you can directly copy and paste into a `README.md` file for your GitHub repository:

```markdown
# Event Planner App

## Overview

The **Event Planner App** is a simple web application designed to help you plan and schedule events. With this app, you can:

- Add events with titles, times, and dates.
- Upload images or videos related to the events.
- Get automatic notifications when the scheduled time for an event arrives.

This app has two parts:
1. **Backend**: A NestJS API that handles events, scheduling, and notifications.
2. **Frontend**: A React web application for interacting with the backend and viewing events.

---

## Installation

To run this app, you'll need to set up both the backend and frontend.

### Step 1: Set up the Backend

1. Navigate to the **backend** directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the backend in development mode:
   ```bash
   npm run dev
   ```

   The backend should now be running and accessible at `http://localhost:4000`.

---

### Step 2: Set up the Frontend

1. Navigate to the **event_planner** directory:
   ```bash
   cd ../event_planner
   ```

2. Install the required dependencies for the frontend:
   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```

   The frontend will now be accessible at `http://localhost:3000`.

---

## Accessing the App

- Open your web browser and go to `http://localhost:3000` to access the frontend and start planning your events.
- The backend API will run at `http://localhost:4000`, which the frontend will interact with.

---

## Features

- **Event Creation**: Create events with a title, date, time, and optional media (images or videos).
- **Event List**: View all scheduled events and their details.
- **Event Notifications**: Receive automatic notifications when an event is about to occur.
- **Media Support**: Upload images or videos related to each event (with file size and type validation).

---

## Technologies Used

- **Frontend**: React
- **Backend**: NestJS
- **Database**: In-memory storage (for simplicity, no persistent database is used)

---

## License

This project is open-source and available under the MIT License.
```

Copy and paste this into a `README.md` file in your repository, and it will be rendered correctly on GitHub with proper formatting.
