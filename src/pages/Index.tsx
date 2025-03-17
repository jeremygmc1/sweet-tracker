
import React, { useState, useEffect } from 'react';
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
import DataSourceToggle from '@/components/DataSourceToggle';
import { Link } from 'react-router-dom';
import { 
  GlucoseReading,
  getGlucoseReadings,
  calculateStats,
  getUserProfile
} from '@/services/api';
import { 
  generateDummyData, 
  calculateStats as calculateDummyStats,
  userData as dummyUserData
} from '@/utils/dummyData';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const Index = () => {
  // State to manage data source (API or dummy data)
  const [useApi, setUseApi] = useLocalStorage('use-api', false);
  
  // Use React Query for API data when useApi is true
  const { 
    data: apiUserData,
    isLoading: isLoadingUser,
    error: userError 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: useApi, // Only fetch when useApi is true
    meta: {
      onError: (error) => {
        toast.error("Failed to load user profile");
        console.error("Error fetching user profile:", error);
      }
    }
  });
  
  // Fetch glucose readings for the past 24 hours from API when useApi is true
  const { 
    data: apiGlucoseData,
    isLoading: isLoadingGlucose,
    error: glucoseError
  } = useQuery({
    queryKey: ['glucoseReadings', 1], // 1 day of data
    queryFn: () => getGlucoseReadings(1),
    enabled: useApi, // Only fetch when useApi is true
    refetchInterval: useApi ? 5 * 60 * 1000 : false, // Only refetch when useApi is true
    meta: {
      onError: (error) => {
        toast.error("Failed to load glucose readings");
        console.error("Error fetching glucose readings:", error);
      }
    }
  });

  // Generate dummy data when not using API
  const [dummyGlucoseData, setDummyGlucoseData] = useState<GlucoseReading[]>([]);
  
  useEffect(() => {
    if (!useApi) {
      // Generate dummy data when not using API
      setDummyGlucoseData(generateDummyData(1)); // 1 day of data
    }
  }, [useApi]);
  
  // Handle toggle between API and dummy data
  const handleDataSourceToggle = (value: boolean) => {
    setUseApi(value);
    toast.success(`Switched to ${value ? 'API data' : 'dummy data'}`);
  };
  
  // Determine which data to use based on toggle state
  const userData = useApi ? apiUserData || { name: "Guest" } : dummyUserData;
  const glucoseData = useApi ? apiGlucoseData || [] : dummyGlucoseData;
  
  // Calculate stats based on the selected data source
  const stats = glucoseData.length > 0 ? 
    (useApi ? calculateStats(glucoseData) : calculateDummyStats(glucoseData)) 
    : null;
  
  // Get the latest and previous readings
  const latestReading = glucoseData.length > 0 ? glucoseData[glucoseData.length - 1] : null;
  const previousReading = glucoseData.length > 1 ? glucoseData[glucoseData.length - 2] : null;

  // Combined loading state (only applicable when API is enabled)
  const isLoading = useApi && (isLoadingUser || isLoadingGlucose);

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
  
  // Error state (only show when API is enabled and there's an error)
  if (useApi && (userError || glucoseError)) {
    console.error("Error fetching data:", userError || glucoseError);
    toast.error("There was an error loading the data. Switching to dummy data.");
    // Auto-switch to dummy data on error
    if (useApi) setUseApi(false);
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
        className="flex justify-between items-center mb-2"
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
      
      <DataSourceToggle useApi={useApi} onToggle={handleDataSourceToggle} />
      
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
