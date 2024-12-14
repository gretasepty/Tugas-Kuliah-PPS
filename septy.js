const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.post('/coba', (req, res) => {
  const { nrp, mhs_name, mhs_addr } = req.body;
  console.log(`Parameter yang dikirim: ${nrp} - ${mhs_name} - ${mhs_addr} `);
  res.json({ message: 'Resource retrieved successfully' });
});



app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  console.log(`Search term: ${searchTerm}`);
  res.send(`Search term: ${searchTerm}`);
});


// ============= create data / insert data
// coba di postman --> (post, x-www-urlencoded)
app.post('/students', (req, res) => {

    console.log('datanya', req.body);
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySql = 'INSERT INTO mahasiswa SET ?';
    console.log('coba create /input baru');
    console.log('datanya=', req.body);

    // jalankan query
    koneksi.query(querySql, data, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Gagal insert data mahasiswa!', error: err });
        }

        // jika request berhasil
        res.status(201).json({ success: true, message: 'Berhasil insert data mahasiswa!' });
    });
});


// ============= read data / get data
// coba di postman --> (get)
app.get('/students', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM mahasiswa';
    console.log('Ini GET' );

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


// ========= get one record data
// coba di postman --> (get)
app.get('/students/:nrp', (req, res) => {
    // buat query sql
    const querySql = `SELECT * FROM mahasiswa WHERE nrp = ${req.params.nrp}`;
    console.log(`Request nrp = ${req.params.nrp}`) 
   

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


// update data 
// coba di postman --> (put, body)
app.put('/students/:nrp', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM mahasiswa WHERE nrp = ?';
    const queryUpdate = 'UPDATE mahasiswa SET ? WHERE nrp = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.nrp, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [data, req.params.nrp], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data mahasiswa!' });
            });
        } else {
            return res.status(404).json({ message: 'Data mahasiswa tidak ditemukan!', success: false });
        }
    });
});


// delete data
// coba di postman --> (delete)
app.delete('/students/:nrp', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM mahasiswa WHERE nrp = ?';
    const queryDelete = 'DELETE FROM mahasiswa WHERE nrp = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.nrp, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.nrp, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});


// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
