import axios from "axios"
import WebSocket from "ws"




let liquidationData = []
const getUSDTcontracts = async () => {
    try {
        const res = await axios.get('https://api.bybit.com/v5/market/instruments-info?category=linear')
        const symbols = res.data.result.list.filter(item=>item.symbol.endsWith("USDT")).map(item=>`liquidation.${item.symbol}`)
        console.log(`Fetched ${symbols.length} USDT symbols`);
        return symbols;


    } catch (error) {
        console.error("failed to fetch symbol",error.message);
        return []
        
    }
}
export const connectToBybit = async () => {
    const args=await getUSDTcontracts()
    if(args.length===0) return
    const socket = new WebSocket('wss://stream.bybit.com/v5/public/linear')
    socket.on('open', () => {
        console.log("connected to Bybit");
        socket.send(JSON.stringify({
            op: 'subscribe',
            args:args,
        }));
    })
    socket.on('message', (data) => {
        console.log(data.toString());
        const parsed = JSON.parse(data)
        if (parsed.topic?.includes('liquidation')) {
            const info = parsed.data
            liquidationData.push(info);
            if (liquidationData.length > 1000) {
                liquidationData.shift()
            }
        }
    })
    socket.on('close', () => {
        console.log("websocket is closed, reconnecting..");
        setTimeout(connectToBybit, 5000)

    })
    socket.on('error', (error) => {
        console.error('WebSocket error', error.message);


    })

}
export const getLiquidations = () => {
    return liquidationData;

}