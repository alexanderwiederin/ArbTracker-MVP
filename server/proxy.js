const express = require('express');
// const proxy = require('http-proxy-middleware');
const cors = require('cors');
const axios = require('axios');

const PORT = 3000;
const app = express();
app.use(cors());


const poloniexUrl = 'https://api.cryptowat.ch/markets/poloniex/btcusdt/orderbook';
const hitbtcUrl = 'https://api.cryptowat.ch/markets/hitbtc/btcusdt/orderbook';

// app.get('/markets/poloniex/btcusdt/orderbook', proxy({ target: poloniexUrl, changeOrigin: true, logLevel: 'debug' }));
// app.get('/markets/hitbtc/btcusdt/orderbook', proxy({ target: hitbtcUrl, changeOrigin: true, logLevel: 'debug'  }));

app.get('/markets/poloniex/btcusdt/orderbook', (req, res) => {
  axios.get(poloniexUrl)
    .then(results => res.status(200).send(results.data))
    .catch(error => res.status(404).send(error));
});

app.get('/markets/hitbtc/btcusdt/orderbook', (req, res) => {
  axios.get(hitbtcUrl)
    .then(results => res.status(200).send(results.data))
    .catch(error => res.status(404).send(error));
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
