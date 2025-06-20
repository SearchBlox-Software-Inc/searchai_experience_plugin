import { useState, useEffect, useRef } from 'react';


// ==========================================================================================


function useThrottle(value, limit) {
   const [throttledValue, setThrottledValue] = useState(value);
   const lastRun = useRef(Date.now());
   const timeoutRef = useRef(null);

   useEffect(() => {
      const now = Date.now();
      const timeElapsed = now - lastRun.current;

      // Clear any existing timeout
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }

      if (timeElapsed >= limit) {
         setThrottledValue(value);
         lastRun.current = now;
      } else {
         timeoutRef.current = setTimeout(() => {
            setThrottledValue(value);
            lastRun.current = Date.now();
         }, limit - timeElapsed);
      }

      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, [value, limit]);

   return throttledValue;
}


export default useThrottle; 