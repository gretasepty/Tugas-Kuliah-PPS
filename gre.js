const express = require('express')
const app = express()
const port = 3000

const koneksi = require('./config/database');

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/coba', (req, res) => {
  res.send('Coba')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

// ini contoh yang tidak lengkap dan akan error jika dijalankan
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


})
