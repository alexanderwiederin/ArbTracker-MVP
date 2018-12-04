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
    tempROI -= Number(trade.volume);
  } else {
    tempROI += Number(trade.volume);
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
      disabledButton: false,
    };
    this.getOrderBook = this.getOrderBook.bind(this);
    this.getUserTrades = this.getUserTrades.bind(this);
    this.setSpread = this.setSpread.bind(this);
    this.refreshOrderBook = this.refreshOrderBook.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { userID } = this.state;
    this.getOrderBook('poloniex');
    this.getOrderBook('hitbtc');
    this.getUserTrades(userID);
    setInterval(() => this.refreshOrderBook('poloniex'), 1000);
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
    const { disabledButton } = this.state;
    this.getOrderBook('poloniex');
    this.getOrderBook('hitbtc');
    if (disabledButton) {
      this.setState((state) => ({ disabledButton: !state.disabledButton }));
    }
  }

  sendTrade(type, volume, price) {
    const { userID } = this.state;
    axios.post(`/${userID}/trades`, {
      userID,
      type,
      volume,
      price,
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  handleClick() {
    const { lowestAsk, highestBid, userID } = this.state;
    const volume = lowestAsk.ask[1] < highestBid.bid[1]
      ? lowestAsk.ask[1] : highestBid.bid[1];
    const purchaseVolume = (highestBid.bid[0] * volume) / lowestAsk.ask[0];
    this.sendTrade('sell', volume, highestBid.bid[0]);
    this.sendTrade('buy', purchaseVolume, lowestAsk.ask[0]);
    this.getUserTrades(userID);
    this.setState((state) => ({ disabledButton: !state.disabledButton }));
  }

  render() {
    const {
      poloniex,
      hitbtc,
      lowestAsk,
      highestBid,
      disabledButton,
      ROI,
    } = this.state;
    return (
      <div>
        <div className="account">
          <div>
            Balance:
            {ROI.toFixed(6)}
            BTC
          </div>
          <div>
            ROI:
            {((ROI - 1) * 100).toFixed(6)}
            %
          </div>
        </div>
        <Overview
          poloniex={poloniex}
          hitbtc={hitbtc}
          lowestAsk={lowestAsk}
          highestBid={highestBid}
        />
        <button disabled={disabledButton} type="submit" onClick={() => this.handleClick()}>Trade!</button>
      </div>
    );
  }
}

export default App;
