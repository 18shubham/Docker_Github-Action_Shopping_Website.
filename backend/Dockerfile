# ── Stage 1: Builder ──────────────────────────────────
# Start from Node 20 on Alpine Linux (tiny 7MB base)
# Name this stage "builder" for reference in Stage 2
FROM node:20-alpine AS builder

# Set working directory inside container
# All commands below run from /app
WORKDIR /app

# Copy dependency files FIRST (layer cache optimization)
# node_modules won't rebuild unless package.json changes
COPY package*.json ./

# Install ALL dependencies (including dev) for building
RUN npm install

# Copy source code AFTER npm install
# Changes here won't bust the npm install cache
COPY . .

# ── Stage 2: Production ───────────────────────────────
# Start completely fresh — nothing from builder carries over
# This is what actually ships to users
FROM node:20-alpine AS production

# Set working directory again in this new clean stage
WORKDIR /app

# Security: create a non-root user and group
# Running as root = security risk if container is breached
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only package files from builder stage
# We need these to run npm install --omit=dev
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies
# Skips nodemon and other dev tools = smaller image
RUN npm install --omit=dev

# Copy only the source code from builder
# Not node_modules, not test files — just our app
COPY --from=builder /app/src ./src

# Give appuser ownership of all files in /app
# Without this, appuser cannot read the app files
RUN chown -R appuser:appgroup /app

# Switch to non-root user for security
# Everything from here runs as appuser, not root
USER appuser

# Document which port the app listens on
# This does NOT open the port — just documentation
EXPOSE 3000

# Command that runs when container starts (not during build)
# Array format ensures signals are handled correctly
CMD ["node", "src/index.js"]
