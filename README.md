# Caching Proxy

A lightweight, CLI-based caching proxy server built with **Node.js**, **Express**, and **node-cache**. It caches responses for repeated requests to significantly reduce response times from ~400ms to 4–5ms — a **99% latency reduction**.

## 🚀 Features

- **CLI-based Proxy Server**: Start the server with a simple command.
- **In-Memory Caching**: Uses `node-cache` to store repeated API responses.
- **Performance Boost**: Caches repeated requests to drastically improve speed.
- **Simple and Lightweight**: Quick to install and run.

##🛠️ Usage
Run the proxy server from the command line:

```bash
  node index.js <port> <origin>
