import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Divider } from "@mui/material";
import { useWebSocketContext } from "../Hooks/Realtime/useWebSocketData";

const BookSelector = () => {
  const { setCoin, setExchange, selectedCoin, selectedExchange } =
    useWebSocketContext();

  //possible coins/exchanges used to create buttons
  const possibleCoins = ["BTC", "ETH", "DOGE", "XRP", "LTC"];
  const exchanges = ["ExchangeX", "ExchangeY"];

  /**
   * this component/header displays all options for coins/exchanges.
   * When a choice is made, this is sent to the webworker via a callback to the
   * piece of context. This tells the socket to only listen to relevent messages.
   */

  return (
    <div className="w-100 p-0 m-0 header">
      <div className="p-5">
        <div className="py-2">
          <div className="float-start">
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
            >
              {possibleCoins.map((c: string, i: number) => {
                let isSelected = c === selectedCoin;
                return (
                  <Button
                    variant={isSelected ? "contained" : "outlined"}
                    color={isSelected ? "success" : "secondary"}
                    key={`coin-button-${i}`}
                    onClick={() => {
                      setCoin(c);
                    }}
                  >
                    {c}
                  </Button>
                );
              })}
            </Stack>
          </div>
          {selectedCoin && exchanges ? (
            <div className="float-end">
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={1}
              >
                {exchanges.map((e: string, i: number) => {
                  let isSelected = selectedExchange === e;
                  return (
                    <Button
                      variant={isSelected ? "contained" : "outlined"}
                      color={isSelected ? "success" : "secondary"}
                      key={`coin-button-${i}`}
                      onClick={() => {
                        setExchange(e);
                      }}
                    >
                      {e}
                    </Button>
                  );
                })}
              </Stack>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default BookSelector;
