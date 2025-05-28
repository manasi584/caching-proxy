const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const { URL } = require('url');

class CachingProxyServer {
    constructor(port, origin){
        this.port = port;
        this.origin = origin;
        this.cache = new NodeCache({stdTTL:3600});
        console.log("For this");
        this.app = express();
    }

  
    async handleRequest(req, res){
       const cacheKey = req.originalUrl;
  if (this.cache.has(cacheKey)) {
    console.log(`[CACHE] ${req.method} ${cacheKey}`);
    const cached = this.cache.get(cacheKey);
    res.set(cached.headers);
    res.status(cached.status).send(cached.body);
    return;
  }

  const targetUrl = new URL(req.originalUrl, this.origin).href;
  console.log(`[FETCH] ${req.method} ${targetUrl}`);

  try {
    const filteredHeaders = { ...req.headers };
    delete filteredHeaders.host;
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: filteredHeaders,
      data: req.body,
    });

    const cachedResponse = {
      status: response.status,
      headers: response.headers,
      body: response.data
    };
    
    this.cache.set(cacheKey, cachedResponse);  

    res.set(response.headers);
    res.status(response.status).send(response.data);
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res.status(502).send("Bad Gateway");
  }
}
start(){
        this.app.get('/*name', this.handleRequest.bind(this));
        this.app.listen(this.port, () => {
            console.log(`Caching Proxy Server running on port ${this.port}`);
          });
    }
clearCache() {
        this.cache.flushAll();
      }
}

module.exports = CachingProxyServer;
