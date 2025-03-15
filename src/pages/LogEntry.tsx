
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { LogEntry, sampleLogEntries } from '@/utils/dummyData';
import LogEntryForm from '@/components/LogEntryForm';
import { Utensils, Pill, Dumbbell, StickyNote, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';

const LogEntryPage = () => {
  const [entries, setEntries] = useState<LogEntry[]>(sampleLogEntries);
  
  const handleAddEntry = (newEntry: Omit<LogEntry, 'id'>) => {
    const entryWithId = {
      ...newEntry,
      id: uuidv4()
    };
    
    setEntries(prev => [entryWithId, ...prev]);
  };
  
  // Icon mapping for entry types
  const entryIcons = {
    food: <Utensils className="h-4 w-4" />,
    medication: <Pill className="h-4 w-4" />,
    exercise: <Dumbbell className="h-4 w-4" />,
    note: <StickyNote className="h-4 w-4" />
  };
  
  // Color mapping for entry types
  const entryColors = {
    food: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medication: 'bg-blue-100 text-blue-700 border-blue-200',
    exercise: 'bg-purple-100 text-purple-700 border-purple-200',
    note: 'bg-amber-100 text-amber-700 border-amber-200'
  };
  
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
        <h1 className="heading-lg mb-1">Log Entries</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Track events that may affect your glucose levels
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LogEntryForm onSubmit={handleAddEntry} />
        
        <motion.div 
          className="card-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="heading-sm mb-6">Recent Entries</h3>
          
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {entries.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-10">
                No entries yet. Add one to get started!
              </p>
            ) : (
              entries.map((entry, index) => (
                <motion.div 
                  key={entry.id}
                  className="glass-card p-4 border border-gray-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 ${entryColors[entry.type]}`}>
                      {entryIcons[entry.type]}
                      <span className="capitalize">{entry.type}</span>
                    </Badge>
                    
                    {entry.glucoseReading && (
                      <span className="text-sm font-medium">
                        {entry.glucoseReading} mg/dL
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm mb-3">{entry.value}</p>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{format(entry.timestamp, 'h:mm a')}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{format(entry.timestamp, 'MMM d, yyyy')}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LogEntryPage;
