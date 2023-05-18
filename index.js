const express = require('express');
const cors = require('cors');
// const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors());
// app.use(express());



app.get('/', (req, res) => {
    res.send('toy server site is running')
})

app.listen(port, (req, res) => {
    console.log(`toy server site is running on port: ${port}`);
})