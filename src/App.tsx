import "./css/App.css";
import BookSelector from "./Components/BookSelector";
import OrderBook from "./Components/OrderBook";
import { WebSocketContextProvider } from "./Hooks/Realtime/useWebSocketData";

/**
 * 
 * main app wrapper
 */
const App = () => {
  return (
    <div className="app">
      <WebSocketContextProvider>
        <BookSelector />
        <div className="p-5">
          <OrderBook />
        </div>
      </WebSocketContextProvider>
    </div>
  );
};

export default App;
