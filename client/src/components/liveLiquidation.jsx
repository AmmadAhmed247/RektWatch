import { useQuery } from '@tanstack/react-query';
import React from 'react';
import axios from "axios";

const LiveLiquidation = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['liquidation'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/bybit`);
      return res.data;
    },
    refetchInterval:1000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div>
      {data?.map((item, index) => (
        <div key={index}>
          <strong>{item.symbol}</strong> — Price: {item.price} — Size: {item.size}
        </div>
      ))}
    </div>
  );
};

export default LiveLiquidation;
