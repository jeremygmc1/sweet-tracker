
import React from 'react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { motion } from 'framer-motion';

interface DataSourceToggleProps {
  useApi: boolean;
  onToggle: (value: boolean) => void;
}

const DataSourceToggle: React.FC<DataSourceToggleProps> = ({ useApi, onToggle }) => {
  return (
    <motion.div 
      className="flex items-center space-x-2 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Label htmlFor="data-source" className="text-sm font-medium cursor-pointer">
        {useApi ? "Using API" : "Using Dummy Data"}
      </Label>
      <Switch 
        id="data-source" 
        checked={useApi}
        onCheckedChange={onToggle}
      />
    </motion.div>
  );
};

export default DataSourceToggle;
