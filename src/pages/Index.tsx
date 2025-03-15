import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  Calendar, 
  ArrowDown, 
  ArrowUp, 
  Bluetooth,
  Laptop
} from 'lucide-react';
import GlucoseChart from '@/components/GlucoseChart';
import GlucoseCard from '@/components/GlucoseCard';
import StatsCard from '@/components/StatsCard';
import { Link } from 'react-router-dom';
import { 
  GlucoseReading,
  getGlucoseReadings,
  calculateStats,
  getUserProfile
} from '@/services/api';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  // Use React Query to fetch and cache data
  const { 
    data: userData = { name: "Guest" },
    isLoading: isLoadingUser 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    // Handle errors gracefully
    onError: () => {
      // Fallback to default user data if API call fails
      return { name: "Guest" };
    }
  });
  
  // Fetch glucose readings for the past 24 hours
  const { 
    data: glucoseData = [],
    isLoading: isLoadingGlucose,
    error: glucoseError
  } = useQuery({
    queryKey: ['glucoseReadings', 1], // 1 day of data
    queryFn: () => getGlucoseReadings(1),
    // Refresh data periodically (every 5 minutes)
    refetchInterval: 5 * 60 * 1000
  });
  
  // Calculate stats based on the glucose data
  const stats = glucoseData.length > 0 ? calculateStats(glucoseData) : null;
  
  // Get the latest and previous readings
  const latestReading = glucoseData.length > 0 ? glucoseData[glucoseData.length - 1] : null;
  const previousReading = glucoseData.length > 1 ? glucoseData[glucoseData.length - 2] : null;

  // Combined loading state
  const isLoading = isLoadingUser || isLoadingGlucose;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="app-container">
        <div className="animate-pulse space-y-6">
          <div className="h-14 bg-gray-200 rounded-xl w-2/3 mb-6"></div>
          <div className="h-56 bg-gray-200 rounded-xl"></div>
          <div className="h-40 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state for glucose data
  if (glucoseError) {
    // We could show a more specific error message, but for now let's keep it simple
    console.error("Error fetching glucose data:", glucoseError);
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
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="heading-lg mb-1">Hello, {userData.name}</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>
        <div className="flex items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3"
          >
            <Bluetooth className="h-5 w-5 text-primary" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Laptop className="h-5 w-5 text-primary" />
          </motion.div>
        </div>
      </motion.div>
      
      {latestReading && previousReading && (
        <GlucoseCard 
          latestReading={latestReading} 
          previousReading={previousReading} 
        />
      )}
      
      <div className="mt-6">
        {glucoseData.length > 0 && <GlucoseChart data={glucoseData} />}
      </div>
      
      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-6">
          <StatsCard 
            title="Average" 
            value={stats.average}
            unit="mg/dL"
            icon={<Activity className="h-5 w-5" />}
            delay={0.1}
            color="bg-violet-50 text-violet-600"
          />
          
          <StatsCard 
            title="Time in Range" 
            value={stats.timeInRange}
            unit="%"
            icon={<Clock className="h-5 w-5" />}
            delay={0.2}
            color="bg-emerald-50 text-emerald-600"
          />
          
          <StatsCard 
            title="Lowest" 
            value={stats.lowest}
            unit="mg/dL"
            icon={<ArrowDown className="h-5 w-5" />}
            delay={0.3}
            color="bg-blue-50 text-blue-600"
          />
          
          <StatsCard 
            title="Highest" 
            value={stats.highest}
            unit="mg/dL"
            icon={<ArrowUp className="h-5 w-5" />}
            delay={0.4}
            color="bg-amber-50 text-amber-600"
          />
        </div>
      )}
      
      <motion.div 
        className="mt-10 mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link to="/log">
          <Button 
            variant="default" 
            className="w-full max-w-xs mx-auto shadow-lg"
          >
            Add New Log Entry
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Index;
