import { useQuery } from '@tanstack/react-query';
import React from 'react';
import axios from "axios";
import { useState } from 'react';
import Heatmap from './heatmap';
const exchangeLogos = {
  binance: "binance.png",
  bybit: "bybit.png",
  okx: "okx.png",
  bitmex: "bitmex.png",

}
const heatMapData = (rawData) => {
  return rawData.map(item => ({
    symbol: item.symbol,
    side: item.side,
    totalUSD: Number(item.totalUSD),
  }))
}
const aggregatedData = (d) => {
  const aggregated = {}
  d.forEach(item => {

    if (!aggregated[item.symbol]) {
      aggregated[item.symbol] = { ...item }
    } else {
      aggregated[item.symbol].totalUSD += item.totalUSD
    }
  })
  return Object.values(aggregated)
}

const formatNumber = (num) => {
  const n = Number(num);
  if (isNaN(n)) return "0";
  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + "B";
  } else if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(2).replace(/\.00$/, '') + "M";
  } else if (n >= 1_000) {
    return (n / 1_000).toFixed(2).replace(/\.00$/, '') + "K";
  } else {
    return n.toFixed(2);
  }
};



const LiveLiquidation = () => {
  const [selected, setSelected] = useState("all")
  const [open, setOpen] = useState(false)
  const exchange = ['all', 'Binance', 'Bybit', 'Okx']


  const { data, isLoading, isError } = useQuery({
    queryKey: ['liquidation'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/liquidation`);
      return res.data;
    },
    refetchInterval: 1000,
  });
  const filtered = selected === "all"
    ? data
    : data.filter((d) => d.exchange.toLowerCase() === selected.toLowerCase());

  const [showAll, setShowAll] = useState(false)
  const displayData = filtered ? (showAll ? filtered.slice(0,17) : filtered.slice(0,30)) : [];
  const HeatMapDataByRows = filtered ? (showAll ? filtered : filtered.slice(0,50)) : [];
  const heatData = data && data.length > 0 ? aggregatedData(heatMapData(HeatMapDataByRows)) : [];


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="flex flex-row gap-2  w-full ">
      <div className="w-[70%] rounded-2xl overflow-hidden">
        <Heatmap data={heatData} />
      </div>
      <div className="flex flex-col bg-zinc-900 border-2 border-zinc-700 w-fit px-4 py-6 rounded-md gap-2">
        <div className="flex flex-row justify-between">
          <h2 className='text-3xl font-semibold mb-5  border-zinc-600 ' >Real Time liquidations</h2>
          <div className=" relative  flex flex-col">

            <div onClick={() => setOpen(!open)} className="flex bg-zinc-700 w-24 px-2 py-2  rounded-md cursor-pointer ">
              <span className='capitalize' >{selected}</span>
              <span>▼</span>
            </div>

            {open && (
              <div className="absolute top-12 z-0 flex-col bg-zinc-800   rounded-md">
                {exchange.map((ex) => (
                  <div onClick={() => { setOpen(false); setSelected(ex) }} key={ex} className="px-2  bg-zinc-800 rounded-md py-2 w-24 cursor-pointer capitalize hover:bg-zinc-700">
                    {ex}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex px-2 py-2  w-fit border-t-2 border-zinc-600 gap-20 flex-row">
          <span className='w-8 text-left'  >Exchange</span>
          <span className='w-15 text-left'  >Name</span>
          <span className='w-10 text-left'  >Price</span>
          <span className='w-10 text-left'  >Side</span>
          <span className='w-20 text-left'  >Total Usd</span>
          <span className='w-15 text-left'  >Time</span>
        </div>
        {displayData.map((item) => (
          <div className={`flex w-fit items-center font-semibold gap-20 px-3 py-2 rounded-md flex-row 
    ${item.side === "BUY"
              ? "bg-green-600/80 transition ease-in-out duration-500 hover:opacity-90"
              : "bg-red-500/80 transition ease-in-out duration-500 hover:opacity-90"} 
   `  }>
            {exchangeLogos[item.exchange.toLowerCase()] && (
              <span className='flex gap-1 flex-row w-8 items-center text-left'><img className=' rounded-full w-6' src={exchangeLogos[item.exchange.toLowerCase()]} alt={item.exchange} />  {item.exchange}</span>
            )
            }
            <span className='w-15  text-left' >{item.symbol}</span>
            <span className='w-10  text-left'  >{item.price}</span>
            <span className='w-10  text-left'  >{item.side}</span>
            <span className='w-20  text-left'  >${formatNumber(item.totalUSD)}</span>
            <span className='w-15  text-left'  >{new Date(item.timestamp).toLocaleTimeString('en-GB')}</span>
          </div>
        ))}
        {data.length > 20 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mx-auto mt-4 text-zinc-400 hover:text-zinc-300 transition flex items-center"
          >
            {showAll ? "▲ Show Less" : "▼ Show More"}
          </button>
        )}

      </div>
    </div>

  );
};

export default LiveLiquidation;
