const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { initDB } = require('./models/db');
const { connectRedis } = require('./models/redis');
const { initMinio } = require('./models/minio');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

global.io = io;

const start = async () => {
  try {
    await initDB();
    await connectRedis();
    await initMinio();
    server.listen(3000, () => console.log('ShopDock API running on port 3000'));
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
};

start();
