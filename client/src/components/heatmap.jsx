import React from "react";
import ReactECharts from "echarts-for-react";
 
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

const Heatmap = ({ data }) => {
  const formattedData = data.map((d) => ({
    name: `${d.symbol}`,
    value: Math.log10(Number(d.totalUSD) + 1),
    realValue: Number(d.totalUSD),
    formatted: formatNumber(d.totalUSD),
    itemStyle: {
      color: d.side === "SELL" ? "#ef4444" : "#22c55e",
    },
  }));


  const option = {
    title: {
      text: "Liquidation Heatmap",  
                    
      top: 0,
      left:0,                       
      textStyle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#f7fffd",
      },
    },
    tooltip: {
       formatter: (info) => `<b>${info.data.name}</b><br/>Value: $${info.data.formatted}`,

    },
    series: [
      {
        type: "treemap",
        data: formattedData,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        top: 40,        // <-- move treemap closer to top
    bottom: 0,     // <-- optional if needed
    left: 0,
    right: 0,
        label: {
          show: true,
          formatter: (params) => `${params.name}\n$${params.data.formatted}`,
          color: "#fff",
          fontSize: 15,
          align: "center",
        },
        upperLabel: { show: false },
      },
    ],
  };

  return (
    <div className="w-full h-[1000px] bg-black rounded-2xl ">
        
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default Heatmap;
