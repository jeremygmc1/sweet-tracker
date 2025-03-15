
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  generateDummyData, 
  calculateStats,
  GlucoseReading,
  getGlucoseStatus
} from '@/utils/dummyData';
import { 
  Clock, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfToday, subDays, eachDayOfInterval } from 'date-fns';

const Stats = () => {
  const [data, setData] = useState<GlucoseReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(7);
  
  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      const dummyData = generateDummyData(timeRange * 24);
      setData(dummyData);
      setIsLoading(false);
    }, 800);
  }, [timeRange]);
  
  // Calculate stats from the data
  const stats = data.length > 0 ? calculateStats(data) : null;
  
  // Process data for daily averages chart
  const getDailyAverages = () => {
    if (data.length === 0) return [];
    
    const days = eachDayOfInterval({
      start: subDays(startOfToday(), timeRange - 1),
      end: startOfToday()
    });
    
    return days.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const dayReadings = data.filter(reading => 
        format(reading.timestamp, 'yyyy-MM-dd') === dayString
      );
      
      if (dayReadings.length === 0) return { day: format(day, 'MMM d'), average: 0 };
      
      const sum = dayReadings.reduce((acc, reading) => acc + reading.value, 0);
      return {
        day: format(day, 'MMM d'),
        average: Math.round(sum / dayReadings.length)
      };
    });
  };
  
  // Process data for distribution chart
  const getDistribution = () => {
    if (data.length === 0) return [];
    
    const statusCount = data.reduce((acc, reading) => {
      acc[reading.status] = (acc[reading.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / data.length) * 100)
    }));
  };
  
  // Distribution chart colors
  const COLORS = ['#FF6B6B', '#48BB78', '#F6AD55'];
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="app-container">
        <div className="animate-pulse space-y-6">
          <div className="h-14 bg-gray-200 rounded-xl w-2/3 mb-6"></div>
          <div className="h-56 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="h-56 bg-gray-200 rounded-xl"></div>
            <div className="h-56 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="heading-lg mb-1">Statistics</h1>
        <p className="text-sm text-muted-foreground">
          Analyze your glucose trends and patterns
        </p>
      </motion.div>
      
      <div className="flex flex-wrap items-center justify-between mt-4 mb-6">
        <div className="flex space-x-1 bg-secondary rounded-full p-1 my-2">
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                timeRange === days
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 my-2">
          <span className="text-sm font-medium">
            {format(subDays(new Date(), timeRange - 1), 'MMM d')} - {format(new Date(), 'MMM d')}
          </span>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" />
            Custom
          </Button>
        </div>
      </div>
      
      {stats && (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <Activity className="h-5 w-5 text-blue-500 mb-2" />
            <span className="text-xs text-gray-500">Average</span>
            <span className="text-lg font-bold">{stats.average}</span>
            <span className="text-xs">mg/dL</span>
          </div>
          
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <Clock className="h-5 w-5 text-green-500 mb-2" />
            <span className="text-xs text-gray-500">Time in Range</span>
            <span className="text-lg font-bold">{stats.timeInRange}%</span>
          </div>
          
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <TrendingUp className="h-5 w-5 text-amber-500 mb-2" />
            <span className="text-xs text-gray-500">Highest</span>
            <span className="text-lg font-bold">{stats.highest}</span>
            <span className="text-xs">mg/dL</span>
          </div>
          
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-rose-500 mb-2" />
            <span className="text-xs text-gray-500">Low Events</span>
            <span className="text-lg font-bold">{stats.lowEvents}</span>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="card-container h-[300px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="heading-sm mb-4">Daily Averages</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getDailyAverages()}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.05)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Bar 
                dataKey="average" 
                fill="#3182CE" 
                radius={[4, 4, 0, 0]} 
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        
        <motion.div 
          className="card-container h-[300px] flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="heading-sm mb-4">Glucose Distribution</h3>
          <div className="flex flex-1 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  animationDuration={500}
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                  labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                >
                  {getDistribution().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '0.5rem',
                    border: 'none',
                    boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.05)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)'
                  }}
                  formatter={(value, name, props) => {
                    if (name === 'count') {
                      return [`${props.payload.percentage}%`, 'Percentage'];
                    }
                    return [value, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Stats;
