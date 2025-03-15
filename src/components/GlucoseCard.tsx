
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowRight, Battery, RefreshCw } from 'lucide-react';
import { GlucoseReading, userData } from '@/utils/dummyData';
import { format } from 'date-fns';

interface GlucoseCardProps {
  latestReading: GlucoseReading;
  previousReading: GlucoseReading;
}

const GlucoseCard: React.FC<GlucoseCardProps> = ({ latestReading, previousReading }) => {
  const difference = latestReading.value - previousReading.value;
  const ArrowIcon = difference < -5 ? ArrowDown : difference > 5 ? ArrowUp : ArrowRight;
  const arrowColor = 
    difference < -5 ? 'text-blue-500' : 
    difference > 5 ? 'text-rose-500' : 
    'text-gray-500';
  
  const bgColor = 
    latestReading.status === 'low' ? 'from-rose-50 to-rose-100' : 
    latestReading.status === 'high' ? 'from-amber-50 to-amber-100' : 
    'from-emerald-50 to-emerald-100';
  
  const valueColor = 
    latestReading.status === 'low' ? 'text-glucose-low' : 
    latestReading.status === 'high' ? 'text-glucose-high' : 
    'text-glucose-normal';

  return (
    <motion.div 
      className={`card-container bg-gradient-to-br ${bgColor} border-none overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">Current Glucose</span>
          <div className="flex items-center mt-1">
            <motion.span 
              className={`heading-lg ${valueColor} mr-2`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {latestReading.value}
            </motion.span>
            <span className="text-sm text-gray-500">mg/dL</span>
          </div>
        </div>
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative"
          >
            <Battery className="h-5 w-5 text-gray-500 mr-2" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-medium">
              {userData.device.batteryLevel}%
            </span>
          </motion.div>
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="cursor-pointer"
          >
            <RefreshCw className="h-5 w-5 text-gray-500" />
          </motion.div>
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        <motion.div
          className={`flex items-center ${arrowColor}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <ArrowIcon className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">
            {Math.abs(difference)} mg/dL
          </span>
        </motion.div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <div>
          <span>Trend: </span>
          <span className="capitalize">{difference < -10 ? 'falling quickly' : difference < -5 ? 'falling' : difference > 10 ? 'rising quickly' : difference > 5 ? 'rising' : 'stable'}</span>
        </div>
        <div>
          <span>Last Updated: </span>
          <span>{format(latestReading.timestamp, 'h:mm a')}</span>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className={`h-full ${
          latestReading.status === 'low' ? 'bg-glucose-low' : 
          latestReading.status === 'high' ? 'bg-glucose-high' : 
          'bg-glucose-normal'
        } opacity-70`}></div>
      </motion.div>
    </motion.div>
  );
};

export default GlucoseCard;
