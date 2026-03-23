# Learners Platform

Portable feature folder for a "Learning Topics" section that you can copy into another project.

## Folder Structure

```text
learners-platform/
  backend/
    controllers/
    data/
    routes/
    services/
    index.js
  frontend/
    components/
    pages/
    services/
    styles/
    index.js
```

## What It Includes

- A reusable React page named `LearnersPlatformPage`
- A lightweight API helper using `fetch`
- A small Express router with sample learning-topic data
- Optional YouTube topic video integration via `YOUTUBE_API_KEY`
- Search, difficulty filtering, featured cards, and topic detail support

## Backend Integration

1. Copy the `learners-platform/backend` folder into your backend project.
2. Mount the router in your Express app:

```js
import express from 'express';
import learnersPlatformRouter from './learners-platform/backend/index.js';

const app = express();

app.use(express.json());
app.use('/api/learners-platform', learnersPlatformRouter);
```

3. Available endpoints:

- `GET /api/learners-platform/topics`
- `GET /api/learners-platform/topics/featured`
- `GET /api/learners-platform/topics/:slug`
- `GET /api/learners-platform/topics/:slug/videos`
- `GET /api/learners-platform/meta`

4. Add your YouTube API key in the backend environment:

```env
YOUTUBE_API_KEY=your_actual_youtube_api_key
```

If the key is missing, the videos endpoint returns an empty list instead of breaking the page.

## Frontend Integration

1. Copy the `learners-platform/frontend` folder into your frontend project.
2. Import the page in your router:

```jsx
import { LearnersPlatformPage } from './learners-platform/frontend/index.js';
```

3. Add a route:

```jsx
<Route
  path="/learners-platform"
  element={<LearnersPlatformPage apiBaseUrl="/api/learners-platform" />}
/>
```

## Notes

- The frontend uses only React and browser `fetch`.
- The backend uses only Express router conventions.
- The YouTube integration uses the YouTube Data API v3 from the backend.
- Replace the sample topic data in `backend/data/topics.js` with your database-backed logic when ready.
