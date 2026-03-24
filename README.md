# Music Top 10

An Express.js application containerized with Docker that fetches the iTunes Top 10 songs, stores them in MongoDB, and serves an interactive chart where each song can be previewed for 30 seconds. MongoDB data is persisted on a Docker volume.

---

## Features

- Fetches the current Top 10 songs from the **Apple iTunes RSS feed**
- Enriches each track with a **30-second preview URL** via the iTunes Lookup API
- Persists songs in **MongoDB** for offline/cached reads
- Click any song row (or the ▶ button) to **play the 30s audio preview**
- Animated progress bar tracks playback; only one song plays at a time

---

## Architecture

Two containers communicate over a shared Docker bridge network.

| Component | Image / Name | Port | Volume |
|---|---|---|---|
| Express server | `custom-server-express` | 8080 → 80 | — |
| MongoDB | `mongo:6` / `mongo-top10` | 27017 | `mongo-data:/data/db` |

- **Network**: `app-net` (bridge)
- **MongoDB URI**: `mongodb://mongo-top10:27017/musicdb` (injected via `MONGO_URI`)

---

## Quick start

```bash
make run
```

Open **http://localhost:8080**, then click **Load from Apple API** to fetch and preview the current chart.

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/top10` | Fetch from Apple RSS + iTunes Lookup, refresh MongoDB, return songs |
| `GET` | `/top10/db` | Return cached songs from MongoDB (no Apple API call) |

### Response shape

```json
{
  "ok": true,
  "count": 10,
  "songs": [
    {
      "title": "I Just Might",
      "author": "Bruno Mars",
      "image": "https://is1-ssl.mzstatic.com/...",
      "previewUrl": "https://audio-ssl.itunes.apple.com/..."
    }
  ]
}
```

---

## Project structure

```
express-server-mongo/
├── Dockerfile
├── Makefile
├── server.js                     # Entry point
├── backend/
│   ├── app/
│   │   ├── createExpressApp.js   # App factory, middleware, route registration
│   │   └── server.js
│   ├── config/
│   │   └── env.js
│   ├── database/
│   │   └── mongo.js              # Mongoose connection
│   ├── models/
│   │   └── songModel.js          # Song schema (title, author, image, previewUrl)
│   ├── routes/
│   │   └── songRoutes.js         # GET /top10, GET /top10/db
│   └── services/
│       └── songService.js        # Apple RSS + iTunes Lookup API logic
└── frontend/
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── main.js               # Event wiring
        ├── apiClient.js          # fetch wrappers for the two API endpoints
        └── ui.js                 # Render list, play/pause logic, progress bar
```

---

## Makefile targets

| Target | Description |
|--------|-------------|
| `make build` | Build the Docker image |
| `make network` | Create the `app-net` bridge network |
| `make run` | Build image, create network & volumes, start both containers |
| `make down` | Stop and remove containers |
| `make logs` | Follow server logs (`docker logs -f`) |
| `make clean` | Stop containers, remove image and volumes |

---

## Manual Docker commands

**Build:**
```bash
docker build -t custom-server-express .
```

**Run:**
```bash
docker network create app-net
docker volume create mongo-data
docker run -d --name mongo-top10 --network app-net -p 27017:27017 \
  -v mongo-data:/data/db mongo:6
docker run -d --name custom-server-express --network app-net -p 8080:80 \
  -e MONGO_URI=mongodb://mongo-top10:27017/musicdb \
  custom-server-express
```

**Stop:**
```bash
docker stop custom-server-express mongo-top10
docker rm custom-server-express mongo-top10
```
