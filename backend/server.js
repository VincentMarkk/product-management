const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: 'user',
  password: 'password',
  server: 'productManagement',
  database: 'productManagement',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

app.get('/products', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT p.id, p.name, p.price, p.category_id, c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM products WHERE id = ${req.params.id}`;
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/products', async (req, res) => {
  try {
    await sql.connect(config);
    const { name, price, category_id } = req.body;
    await sql.query`
      INSERT INTO products (name, price, category_id)
      VALUES (${name}, ${price}, ${category_id})
    `;
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    await sql.connect(config);
    const { name, price, category_id } = req.body;
    await sql.query`
      UPDATE products
      SET name = ${name}, price = ${price}, category_id = ${category_id}
      WHERE id = ${req.params.id}
    `;
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    await sql.connect(config);
    await sql.query`DELETE FROM products WHERE id = ${req.params.id}`;
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/categories', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM categories`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
