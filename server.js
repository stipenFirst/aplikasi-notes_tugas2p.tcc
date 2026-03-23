const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Agar bisa membaca data JSON dari frontend

const db = mysql.createConnection({
  host: '34.59.97.132',
  user: 'admin',                          // Username database VM
  password: 'andika123',                  // Password database VM
  database: 'notes_db'
});

// Cek koneksi database
db.connect((err) => {
  if (err) {
    console.error('Gagal terhubung ke database:', err);
    return;
  }
  console.log('Berhasil terhubung ke MySQL!');
});

// ==========================================
// ROUTES (ENDPOINT API)
// ==========================================

// 1. LIHAT DAFTAR CATATAN (GET)
app.get('/notes', (req, res) => {
  const query = 'SELECT * FROM notes ORDER BY tanggal_dibuat DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. TAMBAH CATATAN BARU (POST)
app.post('/notes', (req, res) => {
  const { judul, isi } = req.body;
  const tanggal_dibuat = new Date(); // Ambil waktu saat ini

  const query = 'INSERT INTO notes (judul, isi, tanggal_dibuat) VALUES (?, ?, ?)';
  db.query(query, [judul, isi, tanggal_dibuat], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Catatan berhasil ditambahkan!', id: results.insertId });
  });
});

// 3. EDIT CATATAN (PUT)
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;

  const query = 'UPDATE notes SET judul = ?, isi = ? WHERE id = ?';
  db.query(query, [judul, isi, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Catatan berhasil diperbarui!' });
  });
});

// 4. HAPUS CATATAN (DELETE)
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM notes WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Catatan berhasil dihapus!' });
  });
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Server Backend berjalan di http://localhost:${port}`);
});