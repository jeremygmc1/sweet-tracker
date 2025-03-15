
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, FileText, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Listen for scroll to add shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/log', icon: FileText, label: 'Log' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 inset-x-0 h-16 glass z-50 transition-all duration-300",
      scrolled && "shadow-lg"
    )}>
      <div className="h-full max-w-screen-xl mx-auto flex items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center justify-center h-full w-full"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ 
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.7
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex flex-col items-center justify-center",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1/3 h-0.5 bg-primary rounded-full"
                    transition={{ duration: 0.3, type: "spring" }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
