'use client';

// POLISH PHASE: Enterprise-grade page transitions with Framer Motion

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  trigger: number | string; // Trigger value that causes re-animation
  direction?: 'left' | 'right' | 'up' | 'down';
}

export default function AnimatedTransition({ 
  children, 
  trigger, 
  direction = 'left' 
}: AnimatedTransitionProps) {
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [trigger]);
  
  // Sophisticated animation variants for consulting-grade presentation
  const getAnimationVariants = () => {
    const baseTransition = {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      mass: 0.8
    };
    
    switch (direction) {
      case 'left':
        return {
          initial: { opacity: 0, x: -60, scale: 0.95, rotateY: -15 },
          animate: { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            rotateY: 0,
            transition: { ...baseTransition, duration: 0.6 }
          },
          exit: { 
            opacity: 0, 
            x: 60, 
            scale: 0.95, 
            rotateY: 15,
            transition: { duration: 0.3, ease: "easeOut" }
          }
        };
      case 'right':
        return {
          initial: { opacity: 0, x: 60, scale: 0.95, rotateY: 15 },
          animate: { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            rotateY: 0,
            transition: { ...baseTransition, duration: 0.6 }
          },
          exit: { 
            opacity: 0, 
            x: -60, 
            scale: 0.95, 
            rotateY: -15,
            transition: { duration: 0.3, ease: "easeOut" }
          }
        };
      case 'up':
        return {
          initial: { opacity: 0, y: -40, scale: 0.95, rotateX: -10 },
          animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            rotateX: 0,
            transition: { ...baseTransition, duration: 0.6 }
          },
          exit: { 
            opacity: 0, 
            y: 40, 
            scale: 0.95, 
            rotateX: 10,
            transition: { duration: 0.3, ease: "easeOut" }
          }
        };
      case 'down':
        return {
          initial: { opacity: 0, y: 40, scale: 0.95, rotateX: 10 },
          animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            rotateX: 0,
            transition: { ...baseTransition, duration: 0.6 }
          },
          exit: { 
            opacity: 0, 
            y: -40, 
            scale: 0.95, 
            rotateX: -10,
            transition: { duration: 0.3, ease: "easeOut" }
          }
        };
      default:
        return {
          initial: { opacity: 0, x: -60, scale: 0.95 },
          animate: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: { ...baseTransition, duration: 0.6 }
          },
          exit: { 
            opacity: 0, 
            x: 60, 
            scale: 0.95,
            transition: { duration: 0.3, ease: "easeOut" }
          }
        };
    }
  };
  
  const variants = getAnimationVariants();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        variants={variants as Record<string, any>}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ perspective: '1000px' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}