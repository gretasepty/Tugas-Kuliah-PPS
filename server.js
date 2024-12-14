// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const koneksi = require('./config/database');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));

// Konfigurasi penyimpanan file foto dengan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


// Endpoint untuk menambahkan data mahasiswa
app.post("/add-student", upload.single("photo"), (req, res) => {
  const { name, address } = req.body;
  const photo = req.file ? req.file.filename : null;

  const sql = "INSERT INTO students (name, address, photo) VALUES (?, ?, ?)";
  koneksi.query(sql, [name, address, photo], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error inserting data" });
    }
    res.status(201).json({ message: "Student added successfully" });
  });
});

// servis untuk mendapatkan data mahasiswa
app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students";
  koneksi.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching students data" });
    }
    res.json(results);
  });
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


