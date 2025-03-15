
import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { format, subHours } from 'date-fns';
import { GlucoseReading, userData } from '@/utils/dummyData';
import { motion } from 'framer-motion';

interface GlucoseChartProps {
  data: GlucoseReading[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="glass-card p-3 !shadow-glass-sm">
        <p className="text-xs font-medium">
          {format(new Date(label), 'h:mm a')}
        </p>
        <p className="text-lg font-bold">
          {data.value} mg/dL
        </p>
        <p className={`text-xs capitalize ${
          data.status === 'low' ? 'text-glucose-low' : 
          data.status === 'high' ? 'text-glucose-high' : 
          'text-glucose-normal'
        }`}>
          {data.status}
        </p>
      </div>
    );
  }

  return null;
};

const GlucoseChart: React.FC<GlucoseChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<number>(6);
  
  // Filter data based on selected time range
  const filteredData = data.filter(reading => 
    reading.timestamp >= subHours(new Date(), timeRange)
  );
  
  // Format data for chart
  const chartData = filteredData.map(reading => ({
    timestamp: reading.timestamp,
    value: reading.value,
    status: reading.status
  }));
  
  const timeRangeOptions = [
    { value: 3, label: '3h' },
    { value: 6, label: '6h' },
    { value: 12, label: '12h' },
    { value: 24, label: '24h' }
  ];

  return (
    <motion.div 
      className="card-container h-[300px] sm:h-[400px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="heading-sm">Glucose Trends</h3>
        <div className="flex space-x-1 bg-secondary rounded-full p-1">
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                timeRange === option.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3182CE" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3182CE" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(time) => format(new Date(time), 'h:mm a')}
            tick={{ fontSize: 12 }}
            stroke="#9CA3AF"
          />
          <YAxis 
            domain={[40, 300]}
            tickCount={7}
            tick={{ fontSize: 12 }}
            stroke="#9CA3AF"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={userData.targetRange.max} 
            stroke="#F6AD55" 
            strokeDasharray="3 3"
            strokeWidth={1.5} 
          />
          <ReferenceLine 
            y={userData.targetRange.min} 
            stroke="#F6AD55" 
            strokeDasharray="3 3" 
            strokeWidth={1.5}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3182CE" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorGlucose)" 
            animationDuration={500}
            dot={{ r: 0 }}
            activeDot={{ 
              r: 6, 
              strokeWidth: 2, 
              stroke: '#FFFFFF',
              fill: '#3182CE'
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default GlucoseChart;
