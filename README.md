# Music Top 10

Express app that fetches the iTunes Top 10 songs, stores them in MongoDB, and serves a contact form. Form submissions are saved as JSON on a persistent volume.

---

## Docker

The project runs as two containers on a shared network.

### Architecture

| Component        | Image / Name           | Port  | Volume      |
|----------------|------------------------|-------|-------------|
| Express server | `custom-server-express` | 8080→80 | `form-data:/app/data` |
| MongoDB        | `mongo:6`              | 27017 | `mongo-data:/data/db` |

- **Network**: `app-net` (bridge)
- **MongoDB URI**: `mongodb://mongo-top10:27017/musicdb` (set via `MONGO_URI`)

### Quick start

```bash
make run
```

Then open **http://localhost:8080**.

### Makefile targets

| Target      | Description                              |
|-------------|------------------------------------------|
| `make build`  | Build the Docker image                   |
| `make network` | Create network `app-net`                 |
| `make run`    | Build, create network, start containers  |
| `make down`   | Stop and remove containers               |
| `make logs`   | Follow server logs                       |
| `make clean`  | Stop containers, remove image and volumes|

### Manual Docker commands

**Build:**
```bash
docker build -t custom-server-express .
```

**Run:**
```bash
docker network create app-net
docker volume create mongo-data form-data
docker run -d --name mongo-top10 --network app-net -p 27017:27017 -v mongo-data:/data/db mongo:6
docker run -d --name custom-server-express --network app-net -p 8080:80 \
  -e MONGO_URI=mongodb://mongo-top10:27017/musicdb \
  -v form-data:/app/data \
  custom-server-express
```

**Stop:**
```bash
docker stop custom-server-express mongo-top10
docker rm custom-server-express mongo-top10
```
