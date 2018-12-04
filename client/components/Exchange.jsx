import React from 'react';

const Exchange = ({ exchangeData, exchangeName }) => {
  let bids = [[0, 0]];
  let asks = [[0, 0]];
  if (exchangeData.data) {
    bids = exchangeData.data.result.bids;
    asks = exchangeData.data.result.asks;
  }
  return (
    <div id={exchangeName} className="exchange">
      <img src={`https://s3.amazonaws.com/hrsf105-mvp/${exchangeName.toLowerCase()}.jpg`} />
        <div className="bidask">
          {exchangeName}
          <div>
            bid:
            USDT {bids[0][0].toString()}
          </div>
          <div>
            ask:
            USDT {asks[0][0].toString()}
          </div>
        </div>
    </div>
  );
};

export default Exchange;
