
import React from 'react';
import { motion } from 'framer-motion';
import { GlucoseReading } from '@/utils/dummyData';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  description?: string;
  color?: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  description,
  color = "bg-blue-50 text-blue-600",
  delay = 0
}) => {
  return (
    <motion.div 
      className="card-container flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs text-gray-500 font-medium">{title}</span>
          <div className="flex items-end mt-1">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
          </div>
        </div>
        <motion.div 
          className={`p-2 rounded-full ${color}`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
      {description && (
        <span className="text-xs text-gray-500 mt-3">{description}</span>
      )}
    </motion.div>
  );
};

export default StatsCard;
