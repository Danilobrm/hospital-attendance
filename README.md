## Getting Started 🚀

This document provides instructions for setting up and running the **Hospital Attendance** project locally.

## 1. Get Ready (Prerequisites)

---

Before you start, make sure you have these tools installed on your system:

- **Node.js** (Version 20 recommended)
- **npm** (Node Package Manager)
- **Docker** and **Docker Compose**
- **Expo Go** app on your phone (for mobile testing)

---

## 2. Local Development Setup (Start Services)

The project uses **Docker Compose** to manage backend services like **Redis** (for caching/queuing) and **PostgreSQL** (for the main database). **You must complete this step before running the API or Frontend.**

### 2.1. Project Directory & Pre-flight Check

1. **Navigate** to the root project folder:

```bash
cd ./hospital-attendance
```

> [!Warning]
> Ensure no local PostgreSQL (port 5432) or Redis (port 6379) services are already running on your host machine, as this will cause conflicts.

### 2.2. Launch Docker Services

Use the following command to start the necessary services in the background:

```bash
npm run docker:up
# This starts PostgreSQL and Redis.
```

| Command               | Action                                                                               |
| :-------------------- | :----------------------------------------------------------------------------------- |
| `npm run docker:up`   | Starts the PostgreSQL and Redis containers in the background.                        |
| `npm run docker:down` | **Stops and removes** the containers, networks, and volumes (recommended when done). |
| `npm run docker:stop` | **Stops** the running containers but keeps them for a quick restart later.           |

---

#### 3. Run the Backend (API Server) 💻

The easiest way to work on the API code is to run the server directly on your machine while letting Docker handle the database.

### API Setup & Run

1. **Move** into the API directory:

```bash
cd ./api
```

2. **Install dependencies** (if you haven't yet):

```bash
# npm install
```

3. **Start the API** in development mode:

```bash
npm run start:dev
# The server starts with hot-reloading on port 3000.
```

### Accessing API Documentation

Once the API is running, you can view the interactive documentation (Swagger/OpenAPI) in your web browser:

- **API Documentation:** `http://localhost:3000/api`

---

#### 4. Run the Frontend (Mobile App) 📱

The mobile app is built with **React Native** and uses **Expo**.

### Starting the App

1. **Open a brand new terminal window.**
2. **Move** into the frontend app directory in the new terminal:

```bash
cd ./app
```

3. **Install dependencies** (if you haven't yet):

```bash
# npm install
```

4. **Start the Expo server:** This opens the Metro Bundler dashboard in your browser and prints a QR code to your terminal.

```bash
npm run start
# Keep this terminal window open to watch build progress.
```

### Viewing the App

- **Mobile Device:** Use the **Expo Go** app on your phone to scan the QR code in the terminal or web page.
- **Android Emulator:** Press `a` in your terminal to launch the app on an Android emulator (if configured).

##### Plus Scope

- Authentication + RBAC (admin manages doctors, patients book appointments)
- Idempotency on POST /appointments
- Advanced filtering in GET /appointments
- Notifications (mock endpoint or logs)

> [!Note]
> Couldn't implement the Bonus because I had a problem with N8N authentication
