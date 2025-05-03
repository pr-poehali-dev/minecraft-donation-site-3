
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ServerHistoryPoint } from "@/types/server";

interface ServerChartProps {
  data: ServerHistoryPoint[];
  dataKey: keyof ServerHistoryPoint;
  name: string;
  stroke: string;
  domain?: [number, number];
}

const ServerChart = ({ 
  data, 
  dataKey, 
  name, 
  stroke, 
  domain 
}: ServerChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={domain} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={stroke} 
            name={name} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServerChart;
