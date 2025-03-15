
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import LogEntryForm from '@/components/LogEntryForm';
import { Utensils, Pill, Dumbbell, StickyNote, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { LogEntry, getLogEntries, addLogEntry, deleteLogEntry } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const LogEntryPage = () => {
  // Use React Query to fetch and cache log entries
  const queryClient = useQueryClient();
  
  // Fetch log entries
  const { 
    data: entries = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['logEntries'],
    queryFn: getLogEntries
  });
  
  // Add new log entry mutation
  const addEntryMutation = useMutation({
    mutationFn: addLogEntry,
    onSuccess: () => {
      // Invalidate and refetch the log entries query
      queryClient.invalidateQueries({ queryKey: ['logEntries'] });
      
      toast({
        title: "Success",
        description: "Entry added successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add entry"
      });
    }
  });
  
  const handleAddEntry = (newEntry: Omit<LogEntry, 'id'>) => {
    // Call the mutation to add the entry
    addEntryMutation.mutate(newEntry);
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
  
  // Loading state
  if (isLoading) {
    return (
      <div className="app-container">
        <div className="animate-pulse space-y-6">
          <div className="h-14 bg-gray-200 rounded-xl w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-56 bg-gray-200 rounded-xl"></div>
            <div className="h-56 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="app-container">
        <h1 className="heading-lg mb-1">Error Loading Log Entries</h1>
        <p className="text-red-500">
          {(error as Error).message || "An unexpected error occurred"}
        </p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['logEntries'] })}
        >
          Try Again
        </button>
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
