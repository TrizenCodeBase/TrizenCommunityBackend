# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port (CapRover will use PORT env var)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
  CMD node -e "const http = require('http'); const options = { hostname: 'localhost', port: 80, path: '/health', method: 'GET', timeout: 10000 }; const req = http.request(options, (res) => { let data = ''; res.on('data', chunk => data += chunk); res.on('end', () => { try { const health = JSON.parse(data); process.exit(health.status === 'success' ? 0 : 1); } catch(e) { process.exit(1); } }); }); req.on('error', () => process.exit(1)); req.on('timeout', () => { req.destroy(); process.exit(1); }); req.end();"

# Start the application
CMD ["npm", "start"]
