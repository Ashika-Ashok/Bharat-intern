const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const port = 3004;
const url = 'mongodb://localhost:27017';
const dbName = 'registrationDB';
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
MongoClient.connect(url)
  .then(async (client) => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    app.post('/register', async (req, res) => {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).send('Missing required fields');
      }

      try {
        const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          return res.status(409).send('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await usersCollection.insertOne({ username, email, password: hashedPassword });
        console.log(`New user created with _id: ${result.insertedId}`);
        res.status(200).send('Registration successful!');
      } catch (error) {
        console.error('Error inserting data into MongoDB:', error);
        res.status(500).send('Internal Server Error');
      }
    });
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
    process.on('SIGINT', () => {
      client.close().then(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });