
import { subHours, addHours, addMinutes, format } from 'date-fns';

// Types
export interface GlucoseReading {
  timestamp: Date;
  value: number;
  status: 'low' | 'normal' | 'high';
}

// Helper functions
export const getGlucoseStatus = (value: number): 'low' | 'normal' | 'high' => {
  if (value < 70) return 'low';
  if (value > 180) return 'high';
  return 'normal';
};

// Generate 24 hours of readings every 5 minutes
export const generateDummyData = (hoursBack: number = 24): GlucoseReading[] => {
  const readings: GlucoseReading[] = [];
  const now = new Date();
  const startTime = subHours(now, hoursBack);
  
  // Base pattern with some randomness
  const basePattern = [
    100, 105, 110, 115, 120, 125, // waking up
    130, 140, 150, 160, 170, 160, // breakfast spike
    150, 140, 130, 120, 110, 100, // coming down
    95, 100, 105, 110, 115, 120,  // stable
    130, 145, 160, 170, 160, 145, // lunch spike
    130, 120, 110, 100, 95, 90,   // coming down
    95, 100, 105, 110, 115, 120,  // stable
    135, 150, 165, 175, 165, 150, // dinner spike
    135, 120, 110, 100, 90, 85,   // coming down for sleep
  ];
  
  // Loop through each 5-minute interval
  for (let i = 0; i < hoursBack * 12; i++) {
    const time = addMinutes(startTime, i * 5);
    
    // Get base value from pattern, loop if needed
    const baseValue = basePattern[i % basePattern.length];
    
    // Add randomness (-15 to +15)
    const randomOffset = Math.floor(Math.random() * 31) - 15;
    const value = Math.max(40, Math.min(300, baseValue + randomOffset));
    
    readings.push({
      timestamp: time,
      value,
      status: getGlucoseStatus(value)
    });
  }
  
  return readings;
};

// Stats calculations
export const calculateStats = (readings: GlucoseReading[]) => {
  const values = readings.map(r => r.value);
  
  const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  
  const lowReadings = readings.filter(r => r.status === 'low');
  const highReadings = readings.filter(r => r.status === 'high');
  const normalReadings = readings.filter(r => r.status === 'normal');
  
  const timeInRange = Math.round((normalReadings.length / readings.length) * 100);
  
  const highest = Math.max(...values);
  const lowest = Math.min(...values);
  
  return {
    average,
    timeInRange,
    highest,
    lowest,
    lowEvents: lowReadings.length > 0 ? lowReadings.length : 0,
    highEvents: highReadings.length > 0 ? highReadings.length : 0
  };
};

// Mock user data
export const userData = {
  name: "Alex",
  lastScanned: new Date(),
  targetRange: { min: 70, max: 180 },
  device: {
    name: "Dexcom G6",
    batteryLevel: 75,
    lastSync: new Date()
  }
};

// Mock log entries
export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'food' | 'medication' | 'exercise' | 'note';
  value: string;
  glucoseReading?: number;
}

export const sampleLogEntries: LogEntry[] = [
  {
    id: '1',
    timestamp: subHours(new Date(), 2),
    type: 'food',
    value: 'Salad with grilled chicken',
    glucoseReading: 110
  },
  {
    id: '2',
    timestamp: subHours(new Date(), 5),
    type: 'medication',
    value: '10 units insulin',
    glucoseReading: 145
  },
  {
    id: '3',
    timestamp: subHours(new Date(), 8),
    type: 'exercise',
    value: '30 min walking',
    glucoseReading: 100
  },
  {
    id: '4',
    timestamp: subHours(new Date(), 12),
    type: 'note',
    value: 'Feeling great today!',
    glucoseReading: 95
  },
];
