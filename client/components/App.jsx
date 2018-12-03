import React from 'react';
import axios from 'axios';

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
    };
    this.getOrderBook = this.getOrderBook.bind(this);
    this.getUserTrades = this.getUserTrades.bind(this);
  }

  componentDidMount() {
    this.getOrderBook('poloniex');
    this.getOrderBook('hitbtc');
    this.getUserTrades(this.state.userID);
  }

  getOrderBook(exchange) {
    axios.get(`http://localhost:3000/markets/${exchange}/btcusdt/orderbook`, { crossdomain: true })
      .then(results => this.setState({ [exchange]: results }))
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

  render() {
    return (
      <div>test</div>
    );
  }
}

export default App;
