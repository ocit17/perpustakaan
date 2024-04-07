const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Menggunakan middleware cors
app.use(cors());

// Buat koneksi ke database PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rasa_group',
  password: 'postgres',
  port: 5432,
});

app.use(express.json());

// Route untuk mendapatkan semua buku
app.get('/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Master_Buku');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk menambahkan buku baru
app.post('/books', async (req, res) => {
  const { judul, penulis, penerbit, tahun_terbit } = req.body;

  try {
    const result = await pool.query('INSERT INTO Master_Buku (judul, penulis, penerbit, tahun_terbit) VALUES ($1, $2, $3, $4) RETURNING *', [judul, penulis, penerbit, tahun_terbit]);
    res.status(200).json({success: true, data: result.rows[0], msg: 'Your data has been saved'});
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk menghapus buku berdasarkan ID
app.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM Master_Buku WHERE id = $1', [bookId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await pool.query('DELETE FROM Master_Buku WHERE id = $1', [bookId]);
    res.status(204).send();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk mengupdate buku berdasarkan ID
app.put('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  const { judul, penulis, penerbit, tahun_terbit } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM Master_Buku WHERE id = $1', [bookId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await pool.query('UPDATE Master_Buku SET judul = $1, penulis = $2, penerbit = $3, tahun_terbit = $4 WHERE id = $5', [judul, penulis, penerbit, tahun_terbit, bookId]);
    
    res.status(200).json({success: true, msg: 'Your data has been updated'});
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route buku end =======================================================================================

// Route untuk mendapatkan semua mahasiswa
app.get('/students', async (req, res) => {
  try {
    const result = await pool.query("SELECT *, TO_CHAR(tanggal_lahir, 'YYYY-MM-DD') AS tanggal_lahir FROM Master_Mahasiswa");
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk menambahkan mahasiswa baru
app.post('/students', async (req, res) => {
  const { nama, nim, jurusan, tanggal_lahir } = req.body;
  try {
    const result = await pool.query('INSERT INTO Master_Mahasiswa (nama, nim, jurusan, tanggal_lahir) VALUES ($1, $2, $3, $4) RETURNING *', [nama, nim, jurusan, tanggal_lahir]);
    res.status(200).json({success: true, data: result.rows[0], msg: 'Your data has been saved'});
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk menghapus mahasiswa berdasarkan ID
app.delete('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM Master_Mahasiswa WHERE id = $1', [studentId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await pool.query('DELETE FROM Master_Mahasiswa WHERE id = $1', [studentId]);
    res.status(204).send();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk mengupdate mahasiswa berdasarkan ID
app.put('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const { nama, nim, jurusan, tanggal_lahir } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM Master_Mahasiswa WHERE id = $1', [studentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await pool.query('UPDATE Master_Mahasiswa SET nama = $1, nim = $2, jurusan = $3, tanggal_lahir = $4 WHERE id = $5', [nama, nim, jurusan, tanggal_lahir, studentId]);
    
    res.status(200).json({success: true, msg: 'Your data has been updated'});
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route mahasiswa end =======================================================================================

// Route untuk mendapatkan semua transaksi peminjaman
app.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query("SELECT a.*, TO_CHAR(a.tanggal_peminjaman, 'YYYY-MM-DD') AS tanggal_peminjaman, TO_CHAR(a.tanggal_pengembalian, 'YYYY-MM-DD') AS tanggal_pengembalian, b.nama, b.nim, (SELECT count(*) FROM history_peminjaman WHERE id_transaksi=a.id) as jumlah FROM Transaksi_Peminjaman a JOIN master_mahasiswa b ON a.id_mahasiswa=b.id");
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk menambahkan transaksi peminjaman baru
app.post('/transactions', async (req, res) => {
  const { id_mahasiswa, tanggal_peminjaman, tanggal_pengembalian } = req.body.header;
  const detailData = req.body.detail;

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert header transaction
      const resultHeader = await client.query('INSERT INTO transaksi_peminjaman (id_mahasiswa, tanggal_peminjaman, tanggal_pengembalian, status_pengembalian) VALUES ($1, $2, $3, $4) RETURNING id', [id_mahasiswa, tanggal_peminjaman, tanggal_pengembalian, 0]);
      const idTransaksi = resultHeader.rows[0].id;

      // Insert detail transactions
      const queryText = 'INSERT INTO history_peminjaman (id_transaksi, id_buku, jumlah, tanggal_peminjaman, tanggal_pengembalian) VALUES ($1, $2, $3, $4, $5)';
      for (const data of detailData) {
        await client.query(queryText, [idTransaksi, data.id_buku, data.jumlah, data.tanggal_peminjaman, data.tanggal_pengembalian]);
      }

      await client.query('COMMIT'); // Commit transaksi jika berhasil

      res.status(200).json({success: true, msg: 'Transaction inserted successfully'});
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback transaksi jika terjadi kesalahan
      throw error;
    } finally {
      client.release(); // Lepaskan koneksi klien
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk mengupdate status berdasarkan ID
app.put('/transactions/:id', async (req, res) => {
  const transId = req.params.id;
  const { status_pengembalian } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM transaksi_peminjaman WHERE id = $1', [transId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rak not found' });
    }

    await pool.query('UPDATE transaksi_peminjaman SET status_pengembalian = $1', [status_pengembalian]);
    
    res.status(200).json({success: true, msg: 'Your data has been updated'});
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route transaksi end =======================================================================================

// Route untuk mendapatkan semua data pada tabel rak inventory stok buku
app.get('/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT a.*, b.judul FROM Rak_Inventory_Stok_Buku a JOIN Master_Buku b ON a.id_buku=b.id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk menambahkan data baru pada tabel rak inventory stok buku
app.post('/inventory', async (req, res) => {
  const { id_buku, nama_rak, jumlah } = req.body;
  
  try {
    const result = await pool.query('INSERT INTO Rak_Inventory_Stok_Buku (id_buku, nama_rak, jumlah) VALUES ($1, $2, $3) RETURNING *', [id_buku, nama_rak, jumlah]);
    res.status(200).json({success: true, data: result.rows[0], msg: 'Your data has been saved'});
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: `Internal Server Error ${err}` });
  }
});

// Route untuk mengupdate rak berdasarkan ID
app.put('/inventory/:id', async (req, res) => {
  const rakId = req.params.id;
  const { id_buku, nama_rak, jumlah } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM Rak_Inventory_Stok_Buku WHERE id = $1', [rakId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rak not found' });
    }

    await pool.query('UPDATE Rak_Inventory_Stok_Buku SET id_buku = $1, nama_rak = $2, jumlah = $3 WHERE id = $4', [id_buku, nama_rak, jumlah, rakId]);
    
    res.status(200).json({success: true, msg: 'Your data has been updated'});
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk menghapus rak berdasarkan ID
app.delete('/inventory/:id', async (req, res) => {
  const rakId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM Rak_Inventory_Stok_Buku WHERE id = $1', [rakId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rak not found' });
    }

    await pool.query('DELETE FROM Rak_Inventory_Stok_Buku WHERE id = $1', [rakId]);
    res.status(204).send();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route inventory end =======================================================================================

// Route untuk mendapatkan semua data pada tabel history peminjaman
app.get('/history', async (req, res) => {
  try {
    const result = await pool.query(`SELECT
        c.nim,
        c.nama,
        a.id_buku,
        d.judul,
        TO_CHAR(a.tanggal_peminjaman, 'YYYY-MM-DD') AS tanggal_peminjaman, TO_CHAR(a.tanggal_pengembalian, 'YYYY-MM-DD') AS tanggal_pengembalian,
        EXTRACT(DAY FROM AGE(a.tanggal_pengembalian, a.tanggal_peminjaman)) AS lama_pinjam,
        b.status_pengembalian
      FROM
          history_peminjaman a
      JOIN
          transaksi_peminjaman b ON a.id_transaksi = b.id
      JOIN
          master_mahasiswa c ON b.id_mahasiswa = c.id
      JOIN
    master_buku d ON a.id_buku = d.id`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route history end =======================================================================================

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
