const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Database Connected'))
  .catch((error) => console.log('Database Connection Error: ', error));

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// App Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: `${process.env.FRONTEND_URL}` }));
}

// Middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
