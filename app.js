const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const auth = require('./routes/authRoute');

const app = express();

app.use(express.json({ extended: true }));
app.use('/api/auth', auth);

const PORT = config.get('port') || 5000;
const MONGOURI = config.get('mongoUri');

async function start() {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.listen(PORT, () => console.log(`App is started on port ${PORT}`));
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();

