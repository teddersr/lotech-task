import { useEffect, useState, useMemo, createContext, useContext } from "react";

const WebSocketContext = createContext<WebSocketContextType>({
  socketData: null,
  setCoin: () => {},
  setExchange: () => {},
  selectedCoin: "BTC",
  selectedExchange: "ExhangeX",
});

const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};

/**
 * 
 * This context component receives data from the websocket which has already been formatted
 * via a webworker and makes the data available to any child that uses the useWebSocketContext hook above
 */
const WebSocketContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //separate webworker is used to receive and process data from the websocket
  const webWorker = useMemo(
    () => new Worker(new URL("../../Workers/Worker.js", import.meta.url)),
    []
  );
  const [socketData, setData] = useState<any>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");
  const [selectedExchange, setSelectedExchange] = useState<string>("ExchangeX");
  const [socketStarted, setSocketStarted] = useState(false);

  useEffect(() => {
    if (webWorker) {
      if (!socketStarted) {
        //start connection
        webWorker.postMessage({
          event: "Start_WS",
        });
        webWorker.onmessage = (e) => {
          //update context data when receiving messages from socket connection
          const { data } = e.data;
          setData(data);
        };
        setSocketStarted(true);
      }
    }
  }, [webWorker, socketData]);

  /**
   * the below methods are used to tell the websocket to filter messages only to 
   * the required choices
   */
  const setCoin = (coin: string) => {
    if (webWorker) {
      if (selectedCoin != coin) {
        webWorker.postMessage({
          event: "updateCoin",
          data: coin,
        });
      }
    }
    setSelectedCoin(coin);
  };
  const setExchange = (exchange: string) => {
    if (webWorker) {
      if (exchange != selectedExchange) {
        webWorker.postMessage({
          event: "updateExchange",
          data: exchange,
        });
      }
    }
    setSelectedExchange(exchange);
  };
  let data: WebSocketContextType = {
    socketData,
    setCoin,
    setExchange,
    selectedCoin,
    selectedExchange,
  };

  return (
    <WebSocketContext.Provider value={data}>
      {children}
    </WebSocketContext.Provider>
  );
};

interface WebSocketContextType {
  socketData: any;
  setCoin: (coin: string) => void;
  setExchange: (exchange: string) => void;
  selectedCoin: string;
  selectedExchange: string;
}

export { WebSocketContextProvider, useWebSocketContext };
