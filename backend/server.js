const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillswap")
  .then(() => console.log("MongoDB Local Connected ✅"))
  .catch(err => {
    console.error("MongoDB Local Connection Error ❌");
    console.error(err.message);
    process.exit(1);
  });

// Routes
// We mount auth routes to /api/auth
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/match', require('./routes/match'));
app.use('/api/request', require('./routes/request'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/session', require('./routes/session'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/videos', require('./routes/videos'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
