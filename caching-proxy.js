const express = require('express');
const axios = require('axios');
const { createClient } = require('redis');
const { URL } = require('url');

class CachingProxyServer {
    constructor(port, origin){
        this.port = port;
        this.origin = origin;
        this.app = express();
        this.initRedisClient();
    }

  async initRedisClient() {
    this.redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.redisClient.on('error', err => console.error('Redis Client Error', err));
    await this.redisClient.connect();
}
  
    async handleRequest(req, res){
       const cacheKey = req.originalUrl;

        try {
          const cached = await this.redisClient.get(cacheKey);
          if (cached) {
                console.log(`[CACHE] ${req.method} ${cacheKey}`);
                const cachedResponse = JSON.parse(cached);
                res.set(cachedResponse.headers);
                res.status(cachedResponse.status).send(cachedResponse.body);
                return;
            }
             const targetUrl = new URL(req.originalUrl, this.origin).href;
            console.log(`[FETCH] ${req.method} ${targetUrl}`);

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

            // Cache for 1 hour (3600 seconds)
            await this.redisClient.setEx(cacheKey, 3600, JSON.stringify(cachedResponse));

            res.set(response.headers);
            res.status(response.status).send(response.data);
        } catch (err) {
            console.error(`[ERROR] ${err.message}`);
            res.status(502).send("Bad Gateway");
        }

        }

async start(){
      this.app.get('/*name', this.handleRequest.bind(this));
        this.app.listen(this.port, () => {
            console.log(`Caching Proxy Server running on port ${this.port}`);
        });
    }
async clearCache() {
        await this.redisClient.flushAll();
    }
async close() {
        await this.redisClient.quit();
    }

}

module.exports = CachingProxyServer;
