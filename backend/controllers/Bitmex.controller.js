
import WebSocket from "ws";

const formattedHelper = ({ exchange, symbol, side, price, qty, timestamp, totalUSD }) => ({
  exchange,
  symbol: symbol.replace(/[^A-Z]/g, ""),
  side,
  price: Number(price),
  qty: Number(qty),
  timestamp: Number(timestamp),
  totalUSD
});

export const connectBitmex = (onData) => {
  const ws = new WebSocket("wss://www.bitmex.com/realtime");

  ws.on("open", () => {
    console.log("connected to BitMEX");
    ws.send(JSON.stringify({
      op: "subscribe",
      args: ["liquidation"]
    }));
  });

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      
       
      
      if (data.table === "liquidation" && data.action === "insert") {
        data.data.forEach((item) => {
          onData(formattedHelper({
            exchange: "BitMEX",
            symbol: item.symbol,
            side: item.side.toUpperCase(),
            price: item.price,
            qty: item.leavesQty, 
            timestamp: new Date(item.timestamp).getTime(),
            totalUSD: (Number(item.price) * Number(item.leavesQty)).toFixed(2)
          }));
         
        });
      }
    } catch (err) {
      console.error("BitMEX parsing error:", err.message);
    }
  });

  ws.on("close", () => console.log("BitMEX connection closed"));
  ws.on("error", (err) => console.error("BitMEX error:", err.message));

  
};
