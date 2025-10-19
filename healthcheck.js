#!/usr/bin/env node

/**
 * Simple health check script for Docker
 * This script checks if the server is responding properly
 */

const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET',
    timeout: 10000
};

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        try {
            const health = JSON.parse(data);
            if (health.status === 'success') {
                console.log('Health check passed:', health);
                process.exit(0);
            } else {
                console.error('Health check failed - invalid status:', health);
                process.exit(1);
            }
        } catch (error) {
            console.error('Health check failed - invalid JSON:', error.message);
            console.error('Response data:', data);
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('Health check failed - connection error:', error.message);
    process.exit(1);
});

req.on('timeout', () => {
    console.error('Health check failed - timeout');
    req.destroy();
    process.exit(1);
});

req.end();
