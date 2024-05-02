import { useState, useEffect } from "react";
import { useWebSocketContext } from "../Hooks/Realtime/useWebSocketData";
import { ChartContainer, BarPlot } from "@mui/x-charts";
import { red, green } from "@mui/material/colors";

const OrderBook = () => {
  const { socketData, selectedCoin, selectedExchange } = useWebSocketContext();
  const [bids, setBids] = useState<any[]>();
  const [bidsData, setBidsData] = useState<any[]>();
  const [asks, setAsks] = useState<any[]>();
  const [asksData, setAsksData] = useState<any[]>();

  /**
   * based on selected coin/exchange this component creates shorter lists
   * (the 20 most recent results) of data from the socketto create
   * orderbook tabels and charts
   * these are updated with every worker/context update
   */
  useEffect(() => {
    let coinName = `${selectedCoin}/USD`;
    if (
      socketData &&
      socketData.dataByCoin &&
      socketData.dataByCoin[coinName] &&
      socketData.dataByCoin[coinName][selectedExchange]
    ) {
      let bidsArr = socketData.dataByCoin[coinName][selectedExchange].bids;
      bidsArr = bidsArr.slice(Math.max(bidsArr.length - 20, 0));
      let asksArr = socketData.dataByCoin[coinName][selectedExchange].asks;
      asksArr = asksArr.slice(Math.max(asksArr.length - 20, 0));
      setBids(bidsArr);
      setBidsData(bidsArr.map((b: number[]) => b[0]));
      setAsks(asksArr);
      setAsksData(asksArr.map((a: number[]) => a[0]));
    }
  }, [selectedCoin, selectedExchange, socketData]);

  if (!bids || !asks) return "...loading";

  const redChart = red[300];
  const greenChart = green[500];

  return (
    <div className="px-5">
      <h4>
        {selectedCoin} <small>({selectedExchange})</small>
      </h4>
      <br />
      <div className="w-100 row">
        <div className="w-50 text-center">
          <h5 className="w-100">Bids</h5>
          <table className="w-100">
            <thead>
              <tr>
                <th className="w-50 text-center">Amount ({selectedCoin})</th>
                <th className="w-50 text-center">Price (USD)</th>
              </tr>
            </thead>
            <tbody>
              {bids!.map((b: number[]) => {
                return (
                  <tr>
                    <td className="w-50 text-center">{b[1]}</td>
                    <td className="w-50 text-center">{b[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-50 text-center">
          <h5 className="w-100">Asks</h5>
          <table className="w-100">
            <thead>
              <tr>
                <th className="w-50 text-center">Amount ({selectedCoin})</th>
                <th className="w-50 text-center">Price (USD)</th>
              </tr>
            </thead>
            <tbody>
              {asks!.map((a: number[]) => {
                return (
                  <tr>
                    <td className="w-50 text-center">{a[1]}</td>
                    <td className="w-50 text-center">{a[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* This section contains simple updating barcharts based on the current
        set of data in the tables, which are positioned behind the tables */}

        
        <div className="w-50">
          <div className="bids-container">
            <ChartContainer
              width={530}
              height={660}
              series={[{ data: bidsData, type: "bar" }]}
              colors={[greenChart]}
              xAxis={[{ scaleType: "band", data: bidsData }]}
            >
              <BarPlot />
            </ChartContainer>
          </div>
        </div>
        <div className="w-50">
          <div className="asks-container">
            <ChartContainer
              width={530}
              height={660}
              series={[{ data: asksData, type: "bar" }]}
              colors={[redChart]}
              xAxis={[{ scaleType: "band", data: asksData }]}
            >
              <BarPlot />
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderBook;
