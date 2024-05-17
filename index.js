require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString)
const database = mongoose.connection
const port = 3000
const app = express();
const routes = require('./routes/routes')
const cors = require('cors');

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected!!!!')
});

app.use(express.json());
app.use('/api', routes);
app.use(cors({
    origin: 'http://localhost:4200/',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.listen(port, () =>{
    console.log(`Server Started at ${port}`)
});


