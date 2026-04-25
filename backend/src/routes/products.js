const router = require('express').Router();
const { pool } = require('../models/db');
const { client: redis } = require('../models/redis');
const { auth, adminOnly } = require('../middleware/auth');
const { minioClient, BUCKET } = require('../models/minio');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Get all products with search
router.get('/', async (req, res) => {
  const { search, category } = req.query;
  try {
    const cacheKey = `products:${search || ''}:${category || ''}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    await redis.setEx(cacheKey, 60, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product (admin only)
router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  try {
    let image_url = null;
    if (req.file) {
      const filename = `${Date.now()}-${req.file.originalname}`;
      await minioClient.putObject(BUCKET, filename, req.file.buffer, req.file.size, { 'Content-Type': req.file.mimetype });
      image_url = `/uploads/${filename}`;
    }
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, description, price, stock, category, image_url]
    );
    await redis.del('products::');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category=$5 WHERE id=$6 RETURNING *',
      [name, description, price, stock, category, req.params.id]
    );
    await redis.del('products::');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    await redis.del('products::');
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
