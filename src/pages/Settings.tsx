
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  User, 
  Target, 
  Smartphone, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Toggle,
  Share,
  Download,
  Trash2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { userData } from '@/utils/dummyData';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleReset = () => {
    toast.info("This would reset your data in a real app");
  };
  
  const settingsGroups = [
    {
      title: "User Settings",
      icon: <User className="h-5 w-5" />,
      items: [
        {
          name: "Profile",
          icon: <User className="h-4 w-4" />,
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />
        },
        {
          name: "Notifications",
          icon: <Bell className="h-4 w-4" />,
          action: (
            <Switch 
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          )
        },
        {
          name: "Target Range",
          icon: <Target className="h-4 w-4" />,
          description: `${userData.targetRange.min} - ${userData.targetRange.max} mg/dL`,
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />
        }
      ]
    },
    {
      title: "Device Settings",
      icon: <Smartphone className="h-5 w-5" />,
      items: [
        {
          name: "Connected Device",
          icon: <Smartphone className="h-4 w-4" />,
          description: userData.device.name,
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />
        },
        {
          name: "Dark Mode",
          icon: <Toggle className="h-4 w-4" />,
          action: (
            <Switch 
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          )
        },
        {
          name: "Data Sharing",
          icon: <Share className="h-4 w-4" />,
          action: (
            <Switch 
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          )
        }
      ]
    },
    {
      title: "Data Management",
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          name: "Export Data",
          icon: <Download className="h-4 w-4" />,
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />
        },
        {
          name: "Privacy Policy",
          icon: <Shield className="h-4 w-4" />,
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />
        }
      ]
    },
    {
      title: "Support",
      icon: <HelpCircle className="h-5 w-5" />,
      items: [
        {
          name: "Help & Support",
          icon: <HelpCircle className="h-4 w-4" />,
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />
        },
        {
          name: "About",
          icon: <Info className="h-4 w-4" />,
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />
        }
      ]
    }
  ];
  
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
        <h1 className="heading-lg mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Customize your experience and manage your preferences
        </p>
      </motion.div>
      
      <div className="space-y-8">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div 
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-primary/10 mr-2">
                {group.icon}
              </div>
              <h3 className="heading-sm text-primary">{group.title}</h3>
            </div>
            
            <div className="glass-card overflow-hidden divide-y divide-gray-100">
              {group.items.map((item, itemIndex) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (groupIndex * 0.1) + (itemIndex * 0.05) + 0.2 }}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                  {item.action}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button 
          variant="outline" 
          className="max-w-xs mx-auto text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleReset}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Reset All Data
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
