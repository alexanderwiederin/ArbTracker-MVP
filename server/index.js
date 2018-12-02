const express = require('express');
const parseBody = require('body-parser');
const dbController = require('../database/index.js');

const PORT = 8080;

const app = express();
app.use(parseBody.json());

app.get('/:userID/trades', (req, res) => {
  const { userID } = req.params;
  dbController.getTrades(userID, (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(result);
    }
  });
});

app.post('/:wildcard/trades', (req, res) => {
  dbController.addTrade(req.body, (error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(201).end();
    }
  });
});

app.listen(PORT, () => console.log('listening on Port', PORT));
