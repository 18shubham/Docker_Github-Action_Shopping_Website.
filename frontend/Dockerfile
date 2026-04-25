# ── Stage 1: Builder ──────────────────────────────────
# Need Node.js to compile React source code into
# plain HTML/CSS/JS files using Vite build tool
FROM node:20-alpine AS builder

# All commands run from /app inside this container
WORKDIR /app

# Copy dependency spec FIRST for layer cache
# npm install won't re-run unless package.json changes
COPY package*.json ./

# Install all React dependencies including Vite
RUN npm install

# Copy React source code AFTER npm install
# Source code changes won't bust npm cache
COPY . .

# Compile React into static files in /app/dist
# After this step Node.js is no longer needed
RUN npm run build

# ── Stage 2: Production ───────────────────────────────
# Nginx is a lightweight web server — perfect for
# serving static files. No Node.js needed here.
# Full nginx image is ~25MB vs Node.js ~180MB
FROM nginx:alpine AS production

# Copy ONLY the compiled output from builder stage
# Everything else (node_modules, source code) is discarded
# Nginx serves files from /usr/share/nginx/html by default
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx config with our custom one
# Our config handles: React routing, API proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Document that Nginx listens on port 80 (standard HTTP)
EXPOSE 80

# Start Nginx in foreground mode
# "daemon off" keeps Nginx as main process
# Docker stops container if main process exits
# So we MUST keep it in foreground
CMD ["nginx", "-g", "daemon off;"]
