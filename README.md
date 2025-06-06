# ⚡ Caching Proxy Server (CLI Tool)

A simple and effective CLI-based HTTP caching proxy built with **Node.js**, **Express**, and **Redis**.
It forwards incoming requests to an upstream origin server, caches the response in Redis for 1 hour, and serves future requests from the cache.

---

## 💡 How It Works

* Acts as a **transparent proxy** between clients and an origin API.
* Caches GET request responses in Redis for **1 hour (3600 seconds)**.
* Future requests to the same URL are served directly from the cache.
* Offers CLI commands to **start** the server and **clear** the cache.

---

## 🔧 Requirements

* **Node.js** (v14+ recommended)
* **Redis** running locally or remotely
---

## 🧰 Usage (CLI)

```bash
node index.js <command> [...args]
```

### 🔹 Start the Proxy Server

```bash
node index.js start <port> <origin>
```

#### Example

```bash
node index.js start 3000 https://jsonplaceholder.typicode.com
```

This starts the proxy server on `localhost:3000` and forwards requests to `https://jsonplaceholder.typicode.com`.

Now you can make requests like:

```bash
curl http://localhost:3000/posts/1
```

* The first request fetches from the origin and caches the response.
* Subsequent requests return cached responses from Redis.

---

### 🔹 Clear the Cache

```bash
node index.js clear
```

This flushes **all keys** from the Redis cache.


---

## 📌 Notes

* Only supports **GET** requests for now.
* All cache entries expire after **1 hour**.
* Cache key is based on the full request URL path and query string.

