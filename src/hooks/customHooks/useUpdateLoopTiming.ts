import { useRef, useCallback } from 'react';

const MAX_SAMPLES_DEFAULT = 60; // Reduced from 120 - we don't need 2 seconds of data

// Calculate polling rate from timestamps
const calculateRateFromTimestamps = (samples: number[]): number => {
  if (samples.length < 2) return 0;
  const timeSpan = samples[samples.length - 1] - samples[0];
  const frameCount = samples.length - 1;
  if (timeSpan <= 0) return 0;
  return Math.round((frameCount / timeSpan) * 1000);
};

export interface UseUpdateLoopTimingReturn {
  recordTimestamp: (timestamp: number) => void;
  getCurrentRate: () => number;
  getTimingSamples: () => ReadonlyArray<number>;
}

/**
 * Hook for tracking animation loop timing without causing re-renders.
 * Uses refs instead of state to avoid performance issues.
 */
export const useUpdateLoopTiming = (maxSamples: number = MAX_SAMPLES_DEFAULT): UseUpdateLoopTimingReturn => {
  const timestampsRef = useRef<number[]>([]);
  const currentRateRef = useRef<number>(0);

  const recordTimestamp = useCallback((timestamp: number) => {
    const currentTimestamps = timestampsRef.current;
    currentTimestamps.push(timestamp);
    if (currentTimestamps.length > maxSamples) {
      currentTimestamps.shift();
    }
    // Update rate ref without triggering re-render
    currentRateRef.current = calculateRateFromTimestamps(currentTimestamps);
  }, [maxSamples]);

  const getCurrentRate = useCallback(() => currentRateRef.current, []);
  const getTimingSamples = useCallback(() => timestampsRef.current, []);

  return {
    recordTimestamp,
    getCurrentRate,
    getTimingSamples,
  };
};
