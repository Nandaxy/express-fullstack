const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://Conn:Mvzis4kA0Bf0dVHd@cluster0.08pcdmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB terhubung'))
.catch(err => console.error('Kesalahan koneksi MongoDB:', err));

app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: 'mongodb+srv://Conn:Mvzis4kA0Bf0dVHd@cluster0.08pcdmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
}));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/route'));

const PORT = 3000;

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
