const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const posts = require('./routes/posts');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mern-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);

app.use(cors({
  origin: 'http://localhost:3000', // Adjust to the front-end's URL
  credentials: true,
}));



app.use('/api/posts', posts);


app.listen(5000, () => console.log('Server running on port 5000'));
