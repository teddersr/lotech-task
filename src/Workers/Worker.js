//create a queue for processing socket messages
let GLOBALQUEUE = null;

//default values for coin/exchange choices
let chosenCoin = "BTC";
let chosenExchange = "ExchangeX";

let returnData = {
  coinList: [],
  exchangeList: [],
  dataByCoin: [],
  rawMessages: [],
};

self.onmessage = (e) => {
  const { event, data } = e.data;
  let ws = null;
  switch (event) {
    case "Start_WS":
      //start websocket connection
      StartWebsocket(
        "wss://mock.lo.tech:8443/ws/orderbook",
        (ws_) => (ws = ws_)
      );
      break;
    case "Stop_WS":
      ws.close();
      break;
    case "updateCoin":
      //empty queue including coins/exchanges not relevant to new choice
      returnData.rawMessages = [];
      returnData.dataByCoin = [];
      GLOBALQUEUE = null;
      chosenCoin = data;
      break;
    case "updateExchange":
      //empty queue including coins/exchanges not relevant to new choice
      returnData.rawMessages = [];
      returnData.dataByCoin = [];
      GLOBALQUEUE = null;
      chosenExchange = data;
      break;
    default:
      break;
  }
};

/**
 * timed event - every second this takes the collected socket connections from the queue 
 * and sends them to useWebSocketData to update the Context, so it can be used by the app.
 * This is set on an interval as a makeshift throttle to help constant updates to the UI
 */
function tick() {
  setInterval(() => {
    if (GLOBALQUEUE) {
      self.postMessage({ event: "update", data: GLOBALQUEUE });
      GLOBALQUEUE = null;
    }
  }, 1000);
}

function StartWebsocket(url, callback) {
  const ws = new WebSocket(url);

  ws.onmessage = (m) => {
    let data = ProcessData(JSON.parse(m.data));
    GLOBALQUEUE = data;
  };

  tick();
}

function ProcessData(data) {
  //create list of coins
  if (returnData.coinList.indexOf(data.coin) < 0) {
    returnData.coinList = [...new Set([...returnData.coinList, data.coin])];
  }
  //create list of exchanges
  if (returnData.exchangeList.indexOf(data.exchange) < 0) {
    returnData.exchangeList = [
      ...new Set([...returnData.exchangeList, data.exchange]),
    ];
  }
  if (
    data.coin.includes(chosenCoin) &&
    data.exchange.includes(chosenExchange)
  ) {
    //organise data by exchange and coin name
    if (returnData.dataByCoin && !returnData.dataByCoin[data.coin]) {
      returnData.dataByCoin[data.coin] = {};
      let correctBids = data.bids.filter((b) => b.length === 2 && b[0] && b[1]);
      let correctAsks = data.asks.filter((b) => b.length === 2 && b[0] && b[1]);
      returnData.dataByCoin[data.coin][data.exchange] = {
        bids: [...correctBids],
        asks: [...correctAsks],
      };
    } else if (returnData.dataByCoin && returnData.dataByCoin[data.coin]) {
      if (
        returnData.dataByCoin[data.coin] &&
        returnData.dataByCoin[data.coin][data.exchange]
      ) {
        let correctBids = data.bids.filter(
          (b) => b.length === 2 && b[0] && b[1]
        );
        let correctAsks = data.asks.filter(
          (b) => b.length === 2 && b[0] && b[1]
        );
        returnData.dataByCoin[data.coin][data.exchange].bids = [
          ...returnData.dataByCoin[data.coin][data.exchange].bids,
          ...correctBids,
        ];
        returnData.dataByCoin[data.coin][data.exchange].asks = [
          ...returnData.dataByCoin[data.coin][data.exchange].asks,
          ...correctAsks,
        ];
      } else {
        let correctBids = data.bids.filter(
          (b) => b.length === 2 && b[0] && b[1]
        );
        let correctAsks = data.asks.filter(
          (b) => b.length === 2 && b[0] && b[1]
        );
        returnData.dataByCoin[data.coin][data.exchange] = {
          bids: [...correctBids],
          asks: [...correctAsks],
        };
      }
    }
  }
  returnData.rawMessages.push(data);
  return returnData;
}
