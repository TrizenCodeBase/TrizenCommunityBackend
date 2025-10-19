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
EXPOSE 5000

# Health check - using simple ping endpoint
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
