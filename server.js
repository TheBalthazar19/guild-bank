const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Guild Bank Bot Alive');
});

app.listen(3000, () => {
  console.log('Web server running');
});