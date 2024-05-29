const express = require('express');
const app = express();
const db = require('./config/db');
app.use(express.json()); // Added this line to enable JSON parsing
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running at http:///localhost:${port}`);
});

// rute untuk menambahkan user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ id: result.insertId, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// rute untuk mendapatkan semua pengguna
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// rute untuk mendapatkan pengguna berdasarkan ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not Found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// rute untuk memperbarui pengguna
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await db.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    res.status(200).json({ id, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// rute untuk menghapus pengguna
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

