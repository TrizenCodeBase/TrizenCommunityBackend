#!/usr/bin/env node

/**
 * Simple deployment test script
 * Tests the health endpoint and basic functionality
 */

const http = require('http');

const testHealthEndpoint = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/health',
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const healthData = JSON.parse(data);
                    console.log('✅ Health endpoint test passed');
                    console.log('📊 Health data:', JSON.stringify(healthData, null, 2));
                    resolve(healthData);
                } catch (error) {
                    console.error('❌ Failed to parse health response:', error);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Health endpoint test failed:', error.message);
            reject(error);
        });

        req.on('timeout', () => {
            console.error('❌ Health endpoint test timed out');
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
};

const runTests = async () => {
    console.log('🧪 Starting deployment tests...\n');
    
    try {
        await testHealthEndpoint();
        console.log('\n✅ All tests passed! Deployment should be working correctly.');
        process.exit(0);
    } catch (error) {
        console.log('\n❌ Tests failed. Check the deployment logs.');
        process.exit(1);
    }
};

// Run tests if this script is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { testHealthEndpoint, runTests };
