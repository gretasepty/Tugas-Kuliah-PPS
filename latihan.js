const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

const users = [
  { id: 1, name: 'John Doe', age: 25 },
  { id: 2, name: 'Jane Doe', age: 30 },
  // Add more user data as needed
];

const tableLabels = ['ID', 'Name', 'Age'];

app.get('/api/users', (req, res) => {
  res.json({ labels: tableLabels, data: users });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
