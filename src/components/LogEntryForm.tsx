
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { LogEntry } from '@/services/api';

interface LogEntryFormProps {
  onSubmit: (entry: Omit<LogEntry, 'id'>) => void;
  isSubmitting?: boolean;
}

const LogEntryForm: React.FC<LogEntryFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [entryType, setEntryType] = useState<'food' | 'medication' | 'exercise' | 'note'>('food');
  const [value, setValue] = useState('');
  const [glucoseReading, setGlucoseReading] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a value for the log entry"
      });
      return;
    }
    
    const newEntry: Omit<LogEntry, 'id'> = {
      timestamp: new Date(),
      type: entryType,
      value: value.trim(),
      glucoseReading: glucoseReading ? Number(glucoseReading) : undefined
    };
    
    onSubmit(newEntry);
    
    // Reset form (only if submission is successful)
    // This will be handled by the onSuccess callback in the mutation
    if (!isSubmitting) {
      setValue('');
      setGlucoseReading('');
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="heading-sm mb-6">Add New Entry</h3>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="entryType">Entry Type</Label>
          <RadioGroup
            value={entryType}
            onValueChange={(value) => setEntryType(value as any)}
            className="flex flex-wrap gap-2"
          >
            {[
              { value: 'food', label: 'Food' },
              { value: 'medication', label: 'Medication' },
              { value: 'exercise', label: 'Exercise' },
              { value: 'note', label: 'Note' }
            ].map((item) => (
              <div key={item.value} className="flex items-center">
                <RadioGroupItem
                  value={item.value}
                  id={item.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={item.value}
                  className="px-3 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-all cursor-pointer"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="entryValue">{entryType === 'note' ? 'Note' : 'Details'}</Label>
          {entryType === 'note' ? (
            <Textarea
              id="entryValue"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your note..."
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          ) : (
            <Input
              id="entryValue"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                entryType === 'food' ? 'What did you eat?' :
                entryType === 'medication' ? 'What medication did you take?' :
                'What exercise did you do?'
              }
              disabled={isSubmitting}
            />
          )}
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="glucoseReading">Glucose Reading (optional)</Label>
          <Input
            id="glucoseReading"
            type="number"
            min="40"
            max="400"
            value={glucoseReading}
            onChange={(e) => setGlucoseReading(e.target.value)}
            placeholder="mg/dL"
            disabled={isSubmitting}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </Button>
      </div>
    </motion.form>
  );
};

export default LogEntryForm;
