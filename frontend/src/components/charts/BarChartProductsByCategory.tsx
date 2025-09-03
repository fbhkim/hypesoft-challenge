'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type DataItem = {
  name: string;
  quantidade: number;
};

export function BarChartProductsByCategory({ data }: { data: DataItem[] }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantidade" fill="#3b82f6" name="Produtos por Categoria" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartProductsByCategory;