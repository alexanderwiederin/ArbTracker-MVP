import React from 'react';
import Exchange from './Exchange';

const Overview = ({
  poloniex,
  hitbtc,
  lowestAsk,
  highestBid,
}) => (
  <div className="overview">
    <span><Exchange id="poloniex" exchangeData={poloniex} exchangeName="Poloniex" /></span>
    <span><Exchange id="hitbtc" exchangeData={hitbtc} exchangeName="HitBTC" /></span>
  </div>
);

export default Overview;
