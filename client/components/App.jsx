import React from 'react';
import axios from 'axios';
import Overview from './Overview';

const findHighestBid = (poloniex, hitbtc) => {
  const poloniexBids = { bid: poloniex.data.result.bids[0], exchange: 'poloniex' };
  const hitbtcBids = { bid: hitbtc.data.result.bids[0], exchange: 'hitbtc' };
  return poloniexBids.bid > hitbtcBids.bid ? poloniexBids : hitbtcBids;
};

const findLowestAsk = (poloniex, hitbtc) => {
  const poloniexAsk = { ask: poloniex.data.result.asks[0], exchange: 'poloniex' };
  const hitbtcAsk = { ask: hitbtc.data.result.asks[0], exchange: 'hitbtc' };
  return poloniexAsk.ask < hitbtcAsk.ask ? poloniexAsk : hitbtcAsk;
};

const calculateROI = trades => trades.reduce((total, trade) => {
  let tempROI = total;
  if (trade.type === 'sell') {
    tempROI -= trade.volume;
  } else {
    tempROI += trade.volume;
  }
  return tempROI;
}, 1) - 1 / 1;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 1,
      trades: [],
      ROI: 0,
      poloniex: {},
      hitbtc: {},
      highestBid: [],
      lowestAsk: [],
    };
    this.getOrderBook = this.getOrderBook.bind(this);
    this.getUserTrades = this.getUserTrades.bind(this);
    this.setSpread = this.setSpread.bind(this);
    this.refreshOrderBook = this.refreshOrderBook.bind(this);
  }

  componentDidMount() {
    const { userID } = this.state;
    this.getOrderBook('poloniex');
    this.getOrderBook('hitbtc');
    this.getUserTrades(userID);
    setInterval(() => this.refreshOrderBook('poloniex'), 10000);
  }

  setSpread() {
    const { poloniex } = this.state;
    const { hitbtc } = this.state;
    const highestBid = findHighestBid(poloniex, hitbtc);
    const lowestAsk = findLowestAsk(poloniex, hitbtc);
    this.setState({ highestBid, lowestAsk });
  }

  getOrderBook(exchange) {
    axios.get(`http://localhost:3000/markets/${exchange}/btcusdt/orderbook`, { crossdomain: true })
      .then((results) => {
        this.setState({ [exchange]: results });
        if (this.state.poloniex.data && this.state.hitbtc.data) {
          this.setSpread();
        }
      })
      .catch(error => console.log(error));
  }

  getUserTrades(userID) {
    axios.get(`/${userID}/trades`)
      .then((response) => {
        const trades = response.data.rows;
        const ROI = calculateROI(trades);
        this.setState({ trades, ROI });
      })
      .catch(error => console.log(error));
  }

  refreshOrderBook() {
    this.getOrderBook('poloniex');
    this.getOrderBook('hitbtc');
  }

  render() {
    const { poloniex } = this.state;
    const { hitbtc } = this.state;
    const { lowestAsk } = this.state;
    const { highestBid } = this.state;
    return (
      <Overview poloniex={poloniex} hitbtc={hitbtc} lowestAsk={lowestAsk} highestBid={highestBid} />
    );
  }
}

export default App;
