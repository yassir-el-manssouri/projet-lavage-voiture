import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 1.5, unit = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: duration,
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  return (
    <span>
      {displayValue.toLocaleString()}
      {unit && <span className="ml-1">{unit}</span>}
    </span>
  );
};

export default AnimatedCounter;
