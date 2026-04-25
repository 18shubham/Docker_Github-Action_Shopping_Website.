const router = require('express').Router();
const { client: redis } = require('../models/redis');
const { auth } = require('../middleware/auth');

const cartKey = (userId) => `cart:${userId}`;

router.get('/', auth, async (req, res) => {
  try {
    const cart = await redis.get(cartKey(req.user.id));
    res.json(cart ? JSON.parse(cart) : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add', auth, async (req, res) => {
  const { productId, name, price, quantity } = req.body;
  try {
    const key = cartKey(req.user.id);
    const existing = await redis.get(key);
    let cart = existing ? JSON.parse(existing) : [];
    const index = cart.findIndex(i => i.productId === productId);
    if (index > -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({ productId, name, price, quantity });
    }
    await redis.setEx(key, 86400, JSON.stringify(cart));
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const key = cartKey(req.user.id);
    const existing = await redis.get(key);
    let cart = existing ? JSON.parse(existing) : [];
    cart = cart.filter(i => i.productId !== parseInt(req.params.productId));
    await redis.setEx(key, 86400, JSON.stringify(cart));
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    await redis.del(cartKey(req.user.id));
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
